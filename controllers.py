"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .settings import APP_FOLDER
from .models import get_user_email
from .food_keyword_requester import get_food_keywords
import spacy
import os
import openai
from dotenv import load_dotenv

load_dotenv()

model_path = os.path.join(APP_FOLDER, "food_ner")
nlp = spacy.load("en_core_web_sm")
# text = "For breakfast, I had eggs and toast. For lunch at Microsoft, I had a salad with chicken and a bowl of soup. For dinner, I had spaghetti with meatballs."

# doc = nlp(text)

# for ent in doc.ents:
#     print(ent.text, ent.label_)
# print(os.getenv("OPENAI_API_KEY"))
url_signer = URLSigner(session)


@action('index')
@action.uses('index.html', db, auth)
def index():

    return dict(
        get_foods_url=URL('get_foods'),
        add_food_url=URL('add_food'),
        remove_food_url=URL('remove_food'),
        recipe=get_recipe(),
    )


def get_recipe():
    ingrids = db(db.foods).select().as_list()
    food_list = ""

    if not ingrids:
        response = "empty"
        return(response)

    openai.api_key = os.getenv("OPENAI_API_KEY")
    print(openai.api_key)

    for item in ingrids:
        foodname = item.get('food_name')
        food_list = food_list+'\n'+foodname
    print(food_list)

    food_prompt = "Create a recipe including these ingredients:\n\n" + food_list + "\nInstruction:\n"
    response = openai.Completion.create(
        model="text-ada-001",
        prompt=food_prompt,
        temperature=0.3,
        max_tokens=300,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    print(response["choices"][0]["text"])
    return response["choices"][0]["text"]


@action("add_food", method=["GET", "POST"])
@action.uses(db)
def add_food():
    food_name = request.params.get("food_name")
    print(food_name)
    foods = get_food_keywords(food_name)
    print(foods)
    for food in foods:
        db.foods.insert(food_name=food)
    return {"foods": foods}


@action("get_foods", method="GET")
@action.uses(db)
def get_foods():
    foods = db(db.foods).select().as_list()
    return {"foods": foods}


@action("remove_food", method=["GET", "POST"])
@action.uses(db)
def remove_food():
    food_name = request.params.get("food_name")
    if food_name:
        db(db.foods.food_name == food_name).delete()
