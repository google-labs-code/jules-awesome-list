# nlp_processor.py

"""
Module for Natural Language Processing (NLP) using spaCy.
This module is responsible for Intent Recognition and Entity Extraction.
"""

import spacy
from spacy.matcher import Matcher
import logging

# --- Setup Logging ---
logger = logging.getLogger(__name__)

# --- spaCy Model Loading ---
# Load the Thai model. This needs to be downloaded first.
# python -m spacy download th_core_web_sm
try:
    nlp = spacy.load("th_core_web_sm")
    logger.info("Successfully loaded spaCy model 'th_core_web_sm'.")
except OSError:
    logger.error("spaCy model 'th_core_web_sm' not found. Please run 'python -m spacy download th_core_web_sm'")
    nlp = None # Set to None to handle errors gracefully

# --- Intent and Entity Recognition Setup ---
matcher = Matcher(nlp.vocab)

# Define patterns for intents
# This is a simple keyword-based approach. A real-world bot might use more complex patterns or text classification.
report_patterns = [
    [{"LOWER": "รายงาน"}],
    [{"LOWER": "สรุป"}],
    [{"LOWER": "report"}]
]
search_patterns = [
    [{"LOWER": "หา"}],
    [{"LOWER": "ค้นหา"}],
    [{"LOWER": "search"}]
]
detail_patterns = [
    [{"LOWER": "ดู"}],
    [{"LOWER": "รายละเอียด"}],
    [{"LOWER": "detail"}]
]

matcher.add("INTENT_REPORT", report_patterns)
matcher.add("INTENT_SEARCH", search_patterns)
matcher.add("INTENT_DETAIL", detail_patterns)


def process_natural_language(text: str) -> dict | None:
    """
    Processes a natural language text string to extract intent and entities.

    :param text: The user's raw text input.
    :return: A dictionary with 'intent' and 'entities' keys, or None if not understood.
             Example: {'intent': 'INTENT_SEARCH', 'entities': {'PERSON': 'สมชาย'}}
    """
    if not nlp:
        logger.error("NLP model is not loaded. Cannot process text.")
        # Return a structured error that can be handled by the bot logic
        return {"error": "NLP model not available. Please contact the administrator."}

    doc = nlp(text)
    matches = matcher(doc)

    # --- Intent Recognition ---
    # Use the first match as the primary intent
    intent = None
    for match_id, start, end in matches:
        string_id = nlp.vocab.strings[match_id]
        if "INTENT_" in string_id:
            intent = string_id
            break # Found the primary intent

    if not intent:
        logger.warning(f"No intent detected for text: '{text}'")
        return None

    # --- Entity Extraction ---
    # spaCy's pre-trained model for Thai might recognize some entities.
    # We can also add custom logic to find specific patterns.
    entities = {}
    for ent in doc.ents:
        entities[ent.label_] = ent.text

    # Custom entity extraction for things the model might miss, like Task IDs
    for token in doc:
        if token.text.upper().startswith('T') and token.text[1:].isdigit():
            entities['TASK_ID'] = token.text.upper()

    logger.info(f"Processed text: '{text}' -> Intent: {intent}, Entities: {entities}")

    return {"intent": intent, "entities": entities}

if __name__ == '__main__':
    # Simple test to run if the script is executed directly.
    print("Testing NLP processor...")
    if nlp:
        test_sentences = [
            "ขอรายงานสรุปหน่อย",
            "ช่วยค้นหาข้อมูลของ สมชาย ให้ที",
            "ขอดูรายละเอียดงาน T123456",
            "วันนี้อากาศดีนะ" # Should not match any intent
        ]
        for sentence in test_sentences:
            result = process_natural_language(sentence)
            print(f"'{sentence}' -> {result}")
    else:
        print("Cannot run test because spaCy model is not loaded.")
