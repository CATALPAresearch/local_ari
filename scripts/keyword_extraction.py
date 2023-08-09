"""
Extract named entities from course titles to be used as keywords

todo:
* test rake itself: https://pypi.org/project/rake-spacy/
* provide params
* rake-nltk und Yake testen
* man könnte noch so etwas wie Word Collocation und Word Co-occurrences untersuchen, je nach dem ob sich das lohnt. 
Für die Untersuchung der Titel bzw. das Herausfiltern von Keywords aus den Titeln ist das aber nicht notwendig. Maximal bei der Beschreibung


python3.9 -m pip install rake_spacy
python3.9 -m pip install compound_split
python3.9 -m spacy download de_core_news_lg
python3.9 -m pip install csv
"""

import os
import argparse
from datetime import datetime
import traceback
import csv
from collections import Counter
from string import punctuation
import pandas as pd
from rake_spacy import Rake

# import RAKE
import spacy
import numpy as np
import re
from compound_split import doc_split

doc_split.MIDDLE_DOT

# python -m spacy download de_core_news_sm
from spacy.lang.de.examples import sentences

# nlp = spacy.load("de_core_news_sm")
nlp = spacy.load("de_core_news_lg")  # Which one is better?

# wordwise
from wordwise import Extractor
extractor = Extractor(spacy_model="de_core_news_lg")

from dotenv import load_dotenv

load_dotenv()



class Keywords:
    """
    Class to extract keywords and add it to existing course metadata
    """

    def __init__(self, method="rake", input=""):
        self.method = method
        self.input = input
        self.commonTerms = [
            "Modul",
            "Abbildung",
            "Übungsaufgabe",
            "Kurstext",
            "Mastermodul",
            "Bachelormodul" "online",
            "Einführung",
            "Grundlage",
            "Grundlagen",
            "Kursbeschreibung",
            "Kursbeschreibungsiehe",
            "Kurseinheit",
            "KursbeschreibungDieser",
            "Kurs",
            "d.h.",
            "ggf.",
            "z.B.",
            "KE",
            "KEs",
            "kurs",
            "KursbeschreibungKursbeschreibung",
        ]

    def getHotwords(self, text):
        """
        Returns hotwords
        """
        result = []
        pos_tag = ["PROPN", "NOUN"]  # ADJ,
        # doc = nlp(text.lower())
        doc = nlp(text)
        for token in doc:
            if token.text in nlp.Defaults.stop_words or token.text in punctuation:
                continue
            if token.pos_ in pos_tag:
                # result.append(token.text)
                result.append(token.lemma_)
        return result

    def getRakeKeywords(self, text):
        """
        Uses rake to extract keywords from a given string
        """
        r = Rake(nlp=nlp)
        res = r.apply(text)
        return res

    def getRakeKeywords2(self, text):
        """
        Uses rake to extract keywords from a given string
        """
        res = []
        r = Rake(
            nlp=nlp, 
            # language='german', # FIXME Germans seems to be not supported
            min_length=1, 
            max_length=3, 
            #include_repeated_phrases=False
            )
        return r.extract_keywords_from_text(text)
        #r.get_ranked_phrases()
        # rake = RAKE.Rake("stopwords-de.txt")  # RAKE.SmartStopList()
        # res = rake.run(text, minCharacters=3, maxWords=9, minFrequency=1)
        return res

    def getSimpleNER(self, text):
        """
        Spacy NER recognition
        """
        return nlp(text).ents

    def getWordwiseKeywords(self, text):
        if len(text.split(' ')) <= 1:
            return text
        if len(text.split(' ')) > 1 and len(text.split(' ')) < 20:
            return text
        r = Rake(nlp=nlp)    
        rake = r.Rake("stopwords-de.txt")  # RAKE.SmartStopList()
        res = r.run(text, minCharacters=3, maxWords=9, minFrequency=1)   
        return extractor.generate(res, top_k=4)

    def removeCommonTerms(self, list):
        """
        Remove terms that are misspelled or misleading for keyword extraction
        """
        res = []
        for l in list:
            if l in self.commonTerms:
                del l
            else:
                res.append(l)
        return res

    def lemmatize(self, list):
        res = []
        for l in list:
            token = nlp(u"" + l)[0]
            res.append(token.lemma_)
        return res

    def resolveCompounds(self, text):
        """
        Resolves compounds in german words, see https://pypi.org/project/compound-split/
        1. Suche Wort, was auf "-" endet
        2. Betrachte das nächste Nomen ohne "-" am Ende und prüfe, ob es sich um ein zusammengesetztes Nomen handelt.
        3. Falls 2. zutrifft, nimm den letzten Teil des zusammengesetzten Nomens und füge ihn an das Wort unter 1. hinzu.
        """
        arr = text.split(" ")
        res = []
        pos_tag = ["NOUN"]  # ADJ, PROP, "NOUN" "PROP", "DET"
        for i in range(0, len(arr)):
            word = arr[i]
            # print(word, nlp(word)[0].pos_, word[-2])
            if word[-1:] == "-" or word[-2:] == "-," or word[-2:] == "-/":
                offset = -2
                if word[-1:] == "-":
                    offset = -1
                # iterate the next three words
                for j in range(i, i + 4):
                    if j < len(arr):
                        if len(nlp(arr[j])) == 0:
                            continue
                        token = nlp(arr[j])[0]
                        if arr[j][-1] == "-":
                            continue
                        if token.pos_ in pos_tag:
                            # identify compounds
                            last_element = doc_split.maximal_split(token.lemma_)[-1]
                            # join last compound to the initial word
                            word = word[:offset] + last_element.lower()
                            word = word.replace("-", "")

            # append all words back
            res.append(word)

        return " ".join(res)

    def preProcessText(self, text):
        """
        Preprocessing pipeline for the input text
        """
        text = self.resolveCompounds(text)
        text = " ".join(self.removeCommonTerms(text.split(" ")))
        return text

    def postProcessKeywords(self, keyword_list):
        """
        Postprocessinf pipeline for the resulting keywords
        """
        res = []
        # remove duplicates
        keyword_list = list(set(keyword_list))
        # lemmatize
        keyword_list = self.lemmatize(keyword_list)
        # remove numeric values
        for word in keyword_list:
            if word.isnumeric():
                continue
            # word = re.sub('\W+','', word)
            # remove URLs
            if len(re.sub(r"http.*?(?=\s)", "", word)) == 0:
                continue
            res.append(word)

        return res

    def processInstances(self):
        """
        Process instances to extract keywords to be saved in the database
        """
        df = pd.DataFrame()
        # open file
        filepath = '/Volumes/DATA0/nise/Downloads/moodle-course-text.csv'
        with open(filepath, newline='') as csvfile:
            instancereader = csv.reader(csvfile, delimiter=';') #, quotechar='|'
            # skip header
            headers = next(instancereader)
            for row in instancereader:
                text = row[5]
        
                if text is None:
                    continue
                if len(text) < 4:
                    continue
                
                text_prep = self.preProcessText(text)
                text_keywords = self.getRakeKeywords2(text_prep)
                #text_keywords = self.getWordwiseKeywords(text_prep) # FIXME not working properly
                
                for w in text_keywords:
                    if str(w[1]).isnumeric():
                        continue
                    # remove URLs
                    #if len(re.sub(r"http.*?(?=\s)", "", str(w[1]))) == 0:
                    #    continue
                    if str(w[1]).count('https://') > 0:
                        continue
                    if str(w[1]).count('http://') > 0:
                        continue
                    if str(w[1]).count("\(") > 0:
                        continue
                    # check if a keywors is on of the common terms
                    isCommon = False
                    for ct in self.commonTerms:
                        if str(w[1]).count(ct) > 0:
                            isCommon = True
                    if isCommon:
                        continue

                    df_row = pd.DataFrame({
                        "course_id": [row[0]],
                        "component": [row[1]], 
                        "instance_url_id": [row[2]], 
                        "instance_id": [row[3]], 
                        "instance_section_num": [row[4]], 
                        "keyword": [str(w[1])],
                        "document_frequency": [w[0]]
                    })
                    df = pd.concat([df, df_row], ignore_index=True)
            
            print(df)
            df = df.drop_duplicates(["course_id", "component", "instance_id", "instance_section_num", "keyword"])
            # TODO: stemming
            # TODO: sum up frequency of duplicates
            #df.to_csv('/Volumes/DATA0/nise/Downloads/content-model.csv', encoding='utf-8', index=False)
            df.to_csv('./content-model.csv', encoding='utf-8', index=False)


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--method", help="[string] rake | ner | hotwords ")
    parser.add_argument("--input", help="File path to CSV document")
    args = parser.parse_args()

    try:
        keywords = Keywords(args.method, args.input)
        keywords.processInstances()
        
        """
        for text in t:
            print(keywords.resolveCompounds(text))
        """

    except Exception as ex:
        print(ex)
        traceback.print_exc()
