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
import spacy
import os

model_path = os.path.join(APP_FOLDER, "food_ner")
# print(model_path)
nlp = spacy.load("en_core_web_sm")
text = "For breakfast, I had eggs and toast. For lunch at Microsoft, I had a salad with chicken and a bowl of soup. For dinner, I had spaghetti with meatballs."
  
doc = nlp(text)
  
for ent in doc.ents:
    print(ent.text, ent.label_)

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth)
def index():
    print("User:", doc.ents)  
    for ent in doc.ents:
        print(ent.text, ent.label_)
    return dict(
        get_foods_url = URL('get_foods'),
        add_food_url = URL('add_food'),
        remove_food_url = URL('remove_food'),
    )

@action("add_food", method=["GET", "POST"])
@action.uses(db)
def add_food():
    food_name = request.params.get("food_name")
    if food_name:
        db.foods.insert(food_name=food_name)

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
