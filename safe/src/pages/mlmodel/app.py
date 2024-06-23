from flask import Flask, render_template,request, jsonify
from flask_cors import CORS
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import pickle

app = Flask(__name__)
cors = CORS(app)

DATA_PATH = "Training.csv"
data = pd.read_csv(DATA_PATH).dropna(axis=1)

encoder = LabelEncoder()
data["prognosis"] = encoder.fit_transform(data["prognosis"])

X = data.iloc[:, :-1]

svm_model = pickle.load(open('svm_model.pkl', 'rb'))
nb_model = pickle.load(open('nb_model.pkl', 'rb'))
rf_model = pickle.load(open('rf_model.pkl', 'rb'))
rf_diabetes_model = pickle.load(open('diabetes.pkl', 'rb'))
heart_disease_model = pickle.load(open('heart_disease.pkl', 'rb'))
parkinsons_model = pickle.load(open('parkinson.pkl', 'rb'))
ckd_model = pickle.load(open('cronic_kidney.pkl', 'rb'))
liver_disease_model = pickle.load(open('liver_disease.pkl', 'rb'))

print("type", type(parkinsons_model))  # This should output something like <class 'sklearn.ensemble._forest.RandomForestClassifier'>

symptoms = X.columns.values

symptom_index = {}
for index, value in enumerate(symptoms):
    symptom = " ".join([i.capitalize() for i in value.split("_")])
    symptom_index[symptom] = index

data_dict = {
    "symptom_index": symptom_index,
    "predictions_classes": encoder.classes_
}


@app.route('/<s>')
def predict(s):
    s = json.loads(s)
    print(s)
    symptoms = []
    for x in s.keys():
        if s[x]:
            symptoms.append(x)
    input_data = [0] * len(data_dict["symptom_index"])
    print(input_data)
    for symptom in symptoms:
        index = data_dict["symptom_index"][symptom]
        input_data[index] = 1
    print(np.array)

    input_data = np.array(input_data).reshape(1, -1)
    print(input_data)

    rf_prediction = data_dict["predictions_classes"][rf_model.predict(input_data)[0]]
    nb_prediction = data_dict["predictions_classes"][nb_model.predict(input_data)[0]]
    svm_prediction = data_dict["predictions_classes"][svm_model.predict(input_data)[0]]
    
    print(rf_prediction)
    print(nb_prediction)
    print(svm_prediction)

    predictions = [rf_prediction, nb_prediction, svm_prediction]
    final_prediction = np.unique(predictions)[0]

    return json.dumps(final_prediction)

@app.route('/predictDiabetes/', methods=['POST'])
def predictDiabetes():
    data = request.get_json(force=True)
    features = np.array([[data['Pregnancies'], data['Glucose'], data['BloodPressure'], data['SkinThickness'],
                          data['Insulin'], data['BMI'], data['DiabetesPedigreeFunction'], data['Age']]])

    # Use loaded rf_diabetes_model to make predictions
    prediction = rf_diabetes_model.predict(features)
    
    return jsonify({'prediction': int(prediction[0])})



@app.route('/predictHeartDisease/', methods=['POST'])
def predictHeartDisease():
    # Get data from the request
    data = request.get_json(force=True)

    # Extract features from the request data and ensure they're numeric
    features = np.array([[
        float(data['age']),
        float(data['sex']),
        float(data['cp']),
        float(data['trestbps']),
        float(data['chol']),
        float(data['fbs']),
        float(data['restecg']),
        float(data['thalach']),
        float(data['exang']),
        float(data['oldpeak']),
        float(data['slope']),
        float(data['ca']),
        float(data['thal'])
    ]])

    # Make a prediction using the heart disease model
    prediction = heart_disease_model.predict(features.reshape(1, -1))
    print(prediction)
    return jsonify({'prediction': int(prediction[0])})


@app.route('/predictParkinsons/', methods=['POST'])
def predictParkinsons():
    # Get data from the request
    data = request.get_json(force=True)

    # Assuming your Parkinson's model expects certain features. 
    # Extract them from the request and convert them to the expected format.
    features = np.array([[
        float(data['MDVP:Fo(Hz)']),
        float(data['MDVP:Fhi(Hz)']),
        float(data['MDVP:Flo(Hz)']),
        float(data['MDVP:Jitter(%)']),
        float(data['MDVP:Jitter(Abs)']),
        float(data['MDVP:RAP']),
        float(data['MDVP:PPQ']),
        float(data['Jitter:DDP']),
        float(data['MDVP:Shimmer']),
        float(data['MDVP:Shimmer(dB)']),
        float(data['Shimmer:APQ3']),
        float(data['Shimmer:APQ5']),
        float(data['MDVP:APQ']),
        float(data['Shimmer:DDA']),
        float(data['NHR']),
        float(data['HNR']),
        float(data['RPDE']),
        float(data['DFA']),
        float(data['spread1']),
        float(data['spread2']),
        float(data['D2']),
        float(data['PPE'])
    ]])

    # Make a prediction with the parkinsons_model
    prediction = parkinsons_model.predict(features.reshape(1, -1))

    
    # Return the prediction as JSON
    return jsonify({'prediction': int(prediction[0])})



@app.route('/predictCKD/', methods=['POST'])
def predictCKD():
    # Get data from the request
    data = request.get_json(force=True)
    
    # Prepare the features array for prediction
    features = np.array([[
        float(data.get('Bp', 0)),
        float(data.get('Sg', 0)),
        float(data.get('Al', 0)),
        float(data.get('Su', 0)),
        float(data.get('Rbc', 0)),
        float(data.get('Bu', 0)),
        float(data.get('Sc', 0)),
        float(data.get('Sod', 0)),
        float(data.get('Pot', 0)),
        float(data.get('Hemo', 0)),
        float(data.get('Wbcc', 0)),
        float(data.get('Rbcc', 0)),
        float(data.get('Htn', 0))
    ]])
    
    # Make a prediction using the chronic kidney disease model
    prediction = ckd_model.predict(features.reshape(1, -1))
    
    # Return the prediction as JSON
    return jsonify({'prediction': int(prediction[0])})

@app.route('/predictLiverDisease/', methods=['POST'])
def predictLiverDisease():
    # Get data from the request
    data = request.get_json(force=True)
    
    # Assuming your liver disease model expects these features in the exact order
    features = np.array([[
          0 if data.get('Gender', 'Male') == 'Female' else 1,
        float(data.get('Age', 0)),
        float(data.get('Total_Bilirubinn', 0)),
        float(data.get('Direct_Bilirubin', 0)),
        float(data.get('Alkaline_Phosphotase', 0)),
        float(data.get('Alamine_Aminotransferase', 0)),
        float(data.get('Aspartate_Aminotransferase', 0)),
        float(data.get('Total_Protiens', 0)),  # Corrected spelling from 'Protiens' to 'Proteins'
        float(data.get('Albumin', 0)),
        float(data.get('Albumin_and_Globulin_Ratio', 0)),
        # Gender needs to be encoded similarly to how it was done during model training
        # For this example, let's assume 0 for Female and 1 for Male
      
    ]])
    
    # Make a prediction using the liver disease model
    prediction = liver_disease_model.predict(features)
    
    # Assuming binary outcome: 1 for "Disease", 0 for "No Disease"
    result = "Disease" if prediction[0] == 1 else "No Disease"
    
    # Return the prediction as JSON
    return jsonify({'prediction': result})



if __name__ == '__main__':
    app.run(debug=True, port=5000)
