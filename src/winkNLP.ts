// Load wink-nlp package.
import winkNLP from 'wink-nlp';
// Load english language model — light version.
import model from 'wink-eng-lite-web-model';

// Instantiate winkNLP.
const nlp = winkNLP(model);
// // Obtain "its" helper to extract item properties.
// const its = nlp.its;
// // Obtain "as" reducer helper to reduce a collection.
// const as = nlp.as;

// window.nlp = nlp;
// window.its = its;
// window.as = as;

const food_ner_patterns = [
    {
        name: 'nounPhrase',
        patterns: ['[PROPN] [|PROPN] [|PROPN] [|PROPN]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[PROPN] [ADJ|PROPN] [|PROPN] [|PROPN]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[PROPN|ADJ] [PROPN]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[PROPN] [CARDINAL]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[PROPN] [CARDINAL]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[NOUN|ADJ] [|NOUN|PROPN|ADJ] [|NOUN|PROPN|ADJ] [|NOUN|PROPN|ADJ] [|NOUN|PROPN|ADJ] [|NOUN|PROPN|ADJ]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[NOUN]']
    },
    {
        name: 'nounPhrase',
        patterns: ['[NOUN]']
    },
    {
        name: 'simpleADJ',
        patterns: ['[ADJ]']
    }
];
nlp.learnCustomEntities(food_ner_patterns, { matchValue: false, useEntity: true, usePOS: true });

export function getNouns(text: string) {
    const doc = nlp.readDoc(text);
    return doc.customEntities().out();
}
