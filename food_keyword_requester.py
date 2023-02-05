import requests
import json


def get_food_keywords(input_string):
    input_words = input_string.split()
    request_body = json.dumps({"ingr": input_words})
    r = requests.post("https://api.edamam.com/api/nutrition-details?app_id=47379841&app_key=d28718060b8adfd39783ead254df7f92", data=request_body, headers={'content-type': 'application/json'}, timeout=5)
    try:
        result = json.loads(r.text)
        if result.get('ingredients', None) is None:
            print("Got Wrong Response", r.text, result)
            return []
        output = []
        for ingredient in result.get("ingredients", []):
            parsed = ingredient.get("parsed", [])
            for parsed_ingredient in parsed:
                pure_ingredient = parsed_ingredient.get("food", None)
                if pure_ingredient is not None:
                    output.append(pure_ingredient)

        return output

    except json.decoder.JSONDecodeError:
        print("Got Invalid JSON", r.text)
        return []


print(get_food_keywords("chickens with romaine sauce"))
