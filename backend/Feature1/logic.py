import os
import json
import torch
import numpy as np
from dotenv import load_dotenv
from groq import Groq

# Load environment vars
load_dotenv()

# Groq client for explanations only
client = Groq("")

# Load local PyTorch rockfall model
MODEL_PATH = "rockfall_model.pt"

class SimpleCNN(torch.nn.Module):
    def __init__(self, in_channels):
        super(SimpleCNN, self).__init__()
        self.conv1 = torch.nn.Conv2d(in_channels, 16, 3, padding=1)
        self.bn1 = torch.nn.BatchNorm2d(16)
        self.conv2 = torch.nn.Conv2d(16, 32, 3, padding=1)
        self.bn2 = torch.nn.BatchNorm2d(32)
        self.conv3 = torch.nn.Conv2d(32, 2, 1)
        self.logsoftmax = torch.nn.LogSoftmax(dim=1)
        self.softmax = torch.nn.Softmax(dim=1)

    def forward(self, x):
        x = torch.relu(self.bn1(self.conv1(x)))
        x = torch.relu(self.bn2(self.conv2(x)))
        out = self.conv3(x)
        return self.logsoftmax(out), self.softmax(out)

# Initialize and load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SimpleCNN(in_channels=6)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

# ------- Prediction logic (using local PyTorch model) -------
def predict_with_local_model(input_tensor, grid_y, grid_x):
    """
    input_tensor: torch tensor shaped [1, channels, H, W]
    grid_y, grid_x: coordinates of interest in the grid
    """
    with torch.no_grad():
        _, probs = model(input_tensor.to(device))
        probs = probs.squeeze(0).cpu().numpy()
    
    pred_class = int(np.argmax(probs[:, grid_y, grid_x]))
    confidence = float(probs[pred_class, grid_y, grid_x])
    CLASS_LABELS = {0: "Safe", 1: "Risk"}
    return CLASS_LABELS.get(pred_class, "Unknown"), confidence

# ------- Explainability logic (using Groq API) -------
def get_explanation_from_groq(prediction_result, input_features):
    """
    prediction_result: dict with prediction and confidence from local model
    input_features: original input data for context
    Returns: natural language explanation
    """
    
    # Create a natural language prompt for Groq
    prompt = f"""
    You are a geological expert explaining rockfall risk predictions. 
    
    Prediction Result:
    - Risk Level: {prediction_result['risk_label']}
    - Confidence: {prediction_result['confidence']:.2%}
    
    Site Conditions:
    - Location: X={input_features['X']}m, Y={input_features['Y']}m, Z={input_features['Z']}m
    - Rock Type: {input_features['Rock_Type_enc']} (encoded)
    - Ore Grade: {input_features['Ore_Grade (%)']}%
    - Tonnage: {input_features['Tonnage']} tonnes
    - Ore Value: ¥{input_features['Ore_Value (¥/tonne)']} per tonne
    - Mining Cost: ¥{input_features['Mining_Cost (¥)']}
    - Processing Cost: ¥{input_features['Processing_Cost (¥)']}
    
    Please provide a clear explanation of:
    1. Why this location shows {prediction_result['risk_label'].lower()} risk
    2. Key factors contributing to this assessment
    3. Recommendations for safety measures
    
    Keep the explanation concise and practical for mining engineers.
    """
    
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",  # Using a more standard Groq model
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        explanation = response.choices[0].message.content
        return {
            "explanation": explanation,
            "key_factors": extract_key_factors(input_features, prediction_result),
            "safety_recommendations": get_safety_recommendations(prediction_result['risk_label'])
        }
        
    except Exception as e:
        return {
            "explanation": f"Error generating explanation: {str(e)}",
            "key_factors": [],
            "safety_recommendations": []
        }

def extract_key_factors(input_features, prediction_result):
    """Extract key contributing factors based on input values"""
    factors = []
    
    # High-risk indicators
    if input_features['Ore_Grade (%)'] > 40:
        factors.append("High ore grade indicates intensive extraction")
    if input_features['Tonnage'] > 1000:
        factors.append("Large tonnage suggests significant excavation")
    if input_features['Z'] > 100:
        factors.append("High elevation increases gravitational risk")
    
    # Safety indicators
    if prediction_result['confidence'] > 0.8:  #you can chnage this and set your own threshold
        factors.append("High model confidence in prediction")
    if input_features['Mining_Cost (¥)'] > input_features['Processing_Cost (¥)'] * 2:
        factors.append("High mining costs may indicate challenging conditions")
    
    return factors

def get_safety_recommendations(risk_level):
    """Get safety recommendations based on risk level"""
    if risk_level == "Risk":
        return [
            "Implement continuous monitoring systems",
            "Establish exclusion zones around high-risk areas",
            "Regular geological surveys and stability assessments",
            "Install early warning systems",
            "Ensure proper slope management and drainage"
        ]
    else:
        return [
            "Maintain regular safety inspections",
            "Continue monitoring for changing conditions",
            "Follow standard safety protocols",
            "Document and track site conditions"
        ]

# ------- Complete inference wrapper -------
def predict_rockfall_with_groq(input_data):
    """
    1) Preprocess input_data to multi-channel tensor and get grid coords
    2) Predict locally with rockfall.pt model  
    3) Get natural language explanation from Groq
    Returns combined dict with prediction + explanation
    """
    
    # Preprocessing for PyTorch model
    channels = 6
    GRID_SIZE = 64
    feature_grid = np.zeros((channels, GRID_SIZE, GRID_SIZE), dtype=np.float32)
    
    # Map coordinates to grid indices (adjust scaling as needed)
    grid_x = min(int((input_data['X'] / 1000) * (GRID_SIZE - 1)), GRID_SIZE - 1)
    grid_y = min(int((input_data['Y'] / 1000) * (GRID_SIZE - 1)), GRID_SIZE - 1)
    
    # Fill feature channels (adjust based on your actual preprocessing)
    # Channel 0: X coordinate normalized
    feature_grid[0, :, :] = input_data['X'] / 1000.0
    # Channel 1: Y coordinate normalized  
    feature_grid[1, :, :] = input_data['Y'] / 1000.0
    # Channel 2: Z elevation normalized
    feature_grid[2, :, :] = input_data['Z'] / 200.0
    # Channel 3: Rock type
    feature_grid[3, :, :] = input_data['Rock_Type_enc'] / 10.0
    # Channel 4: Ore grade
    feature_grid[4, :, :] = input_data['Ore_Grade (%)'] / 100.0
    # Channel 5: Combined economic factors
    economic_factor = (input_data['Ore_Value (¥/tonne)'] * input_data['Tonnage']) / 100000.0
    feature_grid[5, :, :] = economic_factor
    
    # Convert to torch tensor with batch dimension
    input_tensor = torch.tensor(feature_grid).unsqueeze(0)
    
    # Get prediction from local PyTorch model
    pred_label, confidence = predict_with_local_model(input_tensor, grid_y, grid_x)
    
    prediction_result = {
        "risk_label": pred_label,
        "confidence": confidence,
        "grid_position": {"x": grid_x, "y": grid_y}
    }
    
    # Get explanation from Groq (separate from prediction)
    explanation_data = get_explanation_from_groq(prediction_result, input_data)
    
    # Combine results
    return {
        **prediction_result,
        **explanation_data,
        "input_summary": {
            "location": f"({input_data['X']}, {input_data['Y']}, {input_data['Z']})",
            "ore_grade": f"{input_data['Ore_Grade (%)']}%",
            "tonnage": f"{input_data['Tonnage']} tonnes"
        }
    }

# Example standalone test
if __name__ == "__main__":
    sample_input = {
        "X": 500.0, 
        "Y": 400.0, 
        "Z": 50.0,
        "Rock_Type_enc": 2,
        "Ore_Grade (%)": 35.0,
        "Tonnage": 1200.0,
        "Ore_Value (¥/tonne)": 50.0,
        "Mining_Cost (¥)": 30.0,
        "Processing_Cost (¥)": 15.0,
    }
    
    print("Running rockfall prediction...")
    result = predict_rockfall_with_groq(sample_input)
    
    print(f"\n=== PREDICTION RESULTS ===")
    print(f"Risk Level: {result['risk_label']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print(f"Grid Position: {result['grid_position']}")
    
    print(f"\n=== EXPLANATION ===")
    print(result['explanation'])
    
    print(f"\n=== KEY FACTORS ===")
    for factor in result['key_factors']:
        print(f"• {factor}")
    
    print(f"\n=== SAFETY RECOMMENDATIONS ===")
    for rec in result['safety_recommendations']:
        print(f"• {rec}")