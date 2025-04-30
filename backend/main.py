from flask import Flask, request, jsonify
import requests
import re

app = Flask(__name__)

# Predefined makes and body types
car_makes = [
    "toyota", "ford", "bmw", "audi", "honda", "chevrolet", "mercedes", "nissan", "kia", "mazda", "hyundai", "volkswagen"
]
car_body_types = [
    "sedan", "suv", "coupe", "truck", "van", "convertible", "wagon", "hatchback"
]

def extract_keywords(query):
    query_lower = query.lower()

    # Find the make
    make = None
    for known_make in car_makes:
        if known_make in query_lower:
            make = known_make.capitalize()
            break

    # Find the year (4 consecutive digits between 1900-2100)
    year_match = re.search(r'(19\d{2}|20\d{2})', query_lower)
    year = year_match.group() if year_match else None

    # Find body type
    body_type = None
    for body in car_body_types:
        if body in query_lower:
            body_type = body
            break

    return make, year, body_type

@app.route('/search_cars', methods=['POST'])
def search_cars():
    query = request.json.get('query', '')

    make, year, body_type = extract_keywords(query)

    if not make:
        return jsonify({"error": "Car make not found"}), 400

    # Make sure make is lowercase for CarQuery
    make = make.lower()

    # Build correct CarQuery URL
    url = f"https://www.carqueryapi.com/api/0.3/?cmd=getModels&make={make}"
    if year:
        url += f"&year={year}"
    url += "&sold_in_us=1"  # Add this ALWAYS for better results

    headers = {
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch car data"}), 500

    # CarQuery returns JavaScript wrapped response, clean it
    text_data = response.text
    clean_text = text_data.replace('var carquery = ', '').replace(';', '')

    import json
    car_data = json.loads(clean_text)  # safer parsing

    models = car_data.get('Models', [])

    # Optional: filter by body type
    if body_type:
        models = [car for car in models if body_type in (car.get('model_body') or '').lower()]

    # Return first 6 cars
    return jsonify(models[:6])
