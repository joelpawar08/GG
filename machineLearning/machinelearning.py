import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt

# 1. Load dataset
df = pd.read_csv('/home/lenovo/Desktop/OtherOpenSource/GeoGurdians-SIH/dataset.csv')
print(df.columns)

# 2. Preprocessing
le = LabelEncoder()
df['Rock_Type_enc'] = le.fit_transform(df['Rock_Type'])

features = [
    'Ore_Grade (%)',
    'Tonnage',
    'Ore_Value (¥/tonne)',
    'Mining_Cost (¥)',
    'Processing_Cost (¥)',
    'Rock_Type_enc'
]
df[features] = (df[features] - df[features].mean()) / df[features].std()

# 3. Map (X,Y) coords to grid
x_min, x_max = df['X'].min(), df['X'].max()
y_min, y_max = df['Y'].min(), df['Y'].max()
grid_size = 64

def map_to_grid(x, y):
    grid_x = ((x - x_min) / (x_max - x_min) * (grid_size - 1)).astype(int)
    grid_y = ((y - y_min) / (y_max - y_min) * (grid_size - 1)).astype(int)
    return grid_x, grid_y

df['grid_x'], df['grid_y'] = map_to_grid(df['X'], df['Y'])

# 4. Build feature tensor grid for CNN input
channels = len(features)
feature_grid = np.zeros((channels, grid_size, grid_size), dtype=np.float32)

for i, feature in enumerate(features):
    for _, row in df.iterrows():
        feature_grid[i, row['grid_y'], row['grid_x']] = row[feature]

# 5. Build raw target grid with original labels (assumed binary 0/1)
target_grid = np.zeros((grid_size, grid_size), dtype=np.int64)
for _, row in df.iterrows():
    target_grid[row['grid_y'], row['grid_x']] = row['Target']

# 6. Convert binary labels to 4 risk categories: mapping example
# 0 -> Safe (3), 1 -> Critical (0) as simple example - adjust as needed
# Let's assume binary target; we synthesize intermediate classes randomly here for demonstration
risk_map = np.zeros_like(target_grid)
risk_map[target_grid == 0] = 3  # Safe
risk_map[target_grid == 1] = 0  # Critical
# Further logic can be added for Normal and Danger based on probabilities later.

# 7. Dataset and DataLoader
class RockfallDataset(Dataset):
    def __init__(self, features, targets):
        self.features = torch.tensor(features)
        self.targets = torch.tensor(targets)
        
    def __len__(self):
        return 1
    
    def __getitem__(self, idx):
        return self.features, self.targets

dataset = RockfallDataset(feature_grid, target_grid)
loader = DataLoader(dataset, batch_size=1, shuffle=True)

# 8. Define CNN Model
class SimpleCNN(nn.Module):
    def __init__(self, in_channels):
        super(SimpleCNN, self).__init__()
        self.conv1 = nn.Conv2d(in_channels, 16, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(16)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.conv3 = nn.Conv2d(32, 2, 1)  # output 2 classes
        self.logsoftmax = nn.LogSoftmax(dim=1)
        self.softmax = nn.Softmax(dim=1)  # for confidence scores
        
    def forward(self, x):
        x = torch.relu(self.bn1(self.conv1(x)))
        x = torch.relu(self.bn2(self.conv2(x)))
        out = self.conv3(x)
        log_prob = self.logsoftmax(out)
        prob = self.softmax(out)
        return log_prob, prob

# 9. Training Setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SimpleCNN(in_channels=channels).to(device)
criterion = nn.NLLLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 10. Training loop (100 epochs)
model.train()
for epoch in range(500):
    for features_batch, targets_batch in loader:
        features_batch = features_batch.to(device)
        targets_batch = targets_batch.to(device)
        
        optimizer.zero_grad()
        log_probs, _ = model(features_batch)
        loss = criterion(log_probs, targets_batch)
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")

# Save model weights
torch.save(model.state_dict(), "rockfall_model.pt")

# 11. Load model for inference (if separate time)
# model.load_state_dict(torch.load("rockfall_model.pt"))
# model.eval()

# 12. Evaluate model, get predictions and confidence scores
model.eval()
with torch.no_grad():
    test_features = torch.tensor(feature_grid).unsqueeze(0).to(device)
    log_probs, probs = model(test_features)
    predictions = torch.argmax(log_probs, dim=1).squeeze(0).cpu().numpy()
    confidence_scores = torch.max(probs, dim=1)[0].squeeze(0).cpu().numpy()

# 13. Map output probabilities to risk labels (critical, danger, normal, safe)
# For demo, convert binary probs to 4 classes via thresholds on confidence
risk_labels = np.full(predictions.shape, 3)  # Default Safe=3
risk_labels[(predictions==1) & (confidence_scores>0.85)] = 0  # Critical
risk_labels[(predictions==1) & (confidence_scores>0.65)] = 1  # Danger
risk_labels[(predictions==1) & (confidence_scores>0.5)] = 2   # Normal

# 14. Print accuracy metrics with sklearn
y_true = target_grid.flatten()
y_pred = predictions.flatten()

print("Classification Report:\n", classification_report(y_true, y_pred, target_names=['Safe','Critical']))
print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))

# For ROC AUC (binary classification only)
try:
    roc_auc = roc_auc_score(y_true, confidence_scores.flatten())
    print(f"ROC AUC Score: {roc_auc:.4f}")
except Exception as e:
    print(f"ROC AUC Score Exception: {e}")

# 15. Plot confusion matrix heatmap
import seaborn as sns
plt.figure(figsize=(6,5))
cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Safe','Critical'], yticklabels=['Safe','Critical'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.savefig('confusion_matrix.png')

# 16. Plot ROC Curve
fpr, tpr, _ = roc_curve(y_true, confidence_scores.flatten())
plt.figure()
plt.plot(fpr, tpr, label=f'ROC curve (area = {roc_auc:.2f})')
plt.plot([0,1], [0,1], 'k--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend(loc='lower right')
plt.savefig('roc_curve.png')

# 17. Visualize risk label predictions
plt.figure(figsize=(8,6))
cmap = plt.get_cmap('RdYlGn_r', 4)  # 4 discrete colors
plt.imshow(risk_labels, cmap=cmap, vmin=0, vmax=3)
cbar = plt.colorbar(ticks=[0,1,2,3])
cbar.set_ticklabels(['Critical', 'Danger', 'Normal', 'Safe'])
plt.title('Predicted Rockfall Risk Levels')
plt.savefig('risk_level_map.png')

#machine Learning Created




#done