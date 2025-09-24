import json
from urllib3.util import Retry
from requests import Session
from requests.adapters import HTTPAdapter
from dotenv import load_dotenv
import os
load_dotenv()

# Establish session for robust connection
s = Session()
retries = Retry(total=5, backoff_factor=0.1,
                status_forcelist=[500, 501, 502, 503, 504, 524])
s.mount('https://', HTTPAdapter(max_retries=retries))

# API settings
TOKEN = os.getenv('API_KEY_LOGIC_MILL')
URL = 'https://api.logic-mill.net/api/v1/graphql/'
headers = {
  'content-type': 'application/json',
  'Authorization': 'Bearer '+ TOKEN,
}

# Build GraphQL query
query="""
query embedDocumentAndSimilaritySearch($data: [EncodeDocumentPart], $indices: [String], $amount: Int, $model: String!) {
  encodeDocumentAndSimilaritySearch(
    data: $data
    indices: $indices
    amount: $amount
    model: $model
  ) {
    id
    score
    index
    document {
      title
      url
    }
  }
}
"""

# Build variables
variables = {
  "model": "patspecter",
  "data": [
    {
      "key": "title",
      "value": "Airbags"
    },
    {
      "key": "abstract",
      "value": "Airbags are one of the most important safety gears in motor vehicles such as cars and SUVs. These are cushions built into a vehicle that are intended to inflate in case of a car accident in order to protect occupants from injuries by preventing them from striking the interior of vehicle during a crash."
    }
  ],
  "amount": 1,
  "indices": [
    "patents",
    "publications"
  ]
}

# Send request
r = s.post(URL, headers=headers, json={'query': query , 'variables': variables})

# Handle response
if r.status_code != 200:
    print(f"Error executing\n{query}\non {url}")
else:
    response = r.json()
    #print structure of response
    response = response['data']['encodeDocumentAndSimilaritySearch']
    response = response[0]
    print(json.dumps(response, indent=4))
    #print(response)
