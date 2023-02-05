import spacy
from spacy.training.example import Example
from spacy.util import minibatch, compounding
import random

# Load the language model
nlp = spacy.load("en_core_web_sm")

# Define the labels for the entities you want to recognize
LABEL = ["FOOD"]

# Define your training data, with the text and the labels for the entities
TRAIN_DATA = TRAIN_DATA = [
    ("I love to have grilled salmon for lunch.",
     {"entities": [(15, 22, "FOOD")]}),
    ("I enjoy a bowl of vegetable soup for dinner.",
     {"entities": [(17, 30, "FOOD")]}),
    ("Burgers and fries are my go-to fast food choices.",
     {"entities": [(0, 7, "FOOD"), (11, 15, "FOOD")]}),
    ("Sushi is a Japanese dish that I love to eat.",
     {"entities": [(0, 5, "FOOD")]}),
    ("I am a fan of Chinese food, especially hot and sour soup.",
     {"entities": [(20, 28, "FOOD"), (37, 49, "FOOD")]}),
    ("Mexican tacos are my favorite food to eat on weekends.",
     {"entities": [(0, 11, "FOOD")]}),
    ("I like to have eggs and bacon for breakfast.",
     {"entities": [(15, 18, "FOOD"), (21, 26, "FOOD")]}),
    ("Spaghetti with meatballs is a classic Italian dish.",
     {"entities": [(0, 10, "FOOD"), (19, 28, "FOOD")]}),
]


text = "For breakfast, I had eggs and toast. For lunch at Microsoft, I had a salad with chicken and a bowl of soup. For dinner, I had spaghetti with meatballs."

doc = nlp(text)

for ent in doc.ents:
    print(ent.text, ent.label_)

ner = nlp.get_pipe("ner")
ner.add_label("FOOD")

optimizer = nlp.resume_training()
move_names = list(ner.move_names)

# List of pipes you want to train
pipe_exceptions = ["ner", "trf_wordpiecer", "trf_tok2vec"]

# List of pipes which should remain unaffected in training
other_pipes = [pipe for pipe in nlp.pipe_names if pipe not in pipe_exceptions]

# # Start the training, using the defined data and the defined labels
# other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]
# with nlp.disable_pipes(*other_pipes):  # only train NER
#     optimizer = nlp.create_optimizer()
#     for i in range(10):
#         print("Starting iteration " + str(i))
#         for text, annotations in TRAIN_DATA:
#             doc = nlp.make_doc(text)
#             example = Example.from_dict(doc, annotations)
#             nlp.update([example], sgd=optimizer)

with nlp.disable_pipes(*other_pipes):

    sizes = compounding(1.0, 4.0, 1.001)
    # Training for 30 iterations
    for itn in range(10):
        # shuffle examples before training
        random.shuffle(TRAIN_DATA)
        # batch up the examples using spaCy's minibatch
        batches = minibatch(TRAIN_DATA, size=sizes)
        # ictionary to store losses
        losses = {}
        for batch in batches:
            # print(batch)
            texts, annotations = batch[0]
            # Calling update() over the iteration
            doc = nlp.make_doc(texts)
            example = Example.from_dict(doc, annotations)
            nlp.update([example], sgd=optimizer,
                       drop=0.35, losses=losses)
            # print("Losses", losses)

# for pipe_name in nlp.pipe_names:
#     nlp.enable_pipe(pipe_name)

text = "For breakfast, I had eggs and toast. For lunch at Microsoft, I had a salad with chicken and a bowl of soup. For dinner, I had spaghetti with meatballs."

doc = nlp(text)

for ent in doc.ents:
    print(ent.text, ent.label_)

# Save the trained model to use it later
# src_nlp.to_disk("food_ner")
