import os
import re
import xml.etree.ElementTree as ET

import requests

# Constants
ABSTRACT_PREVIEW_LENGTH = 100
HTTP_OK = 200
DATE_FORMAT_LENGTH = 8


class PatentLoader:
    def __init__(self, patent_id: str) -> None:
        """Initialize Patent with patent ID and fetch data from EPO API."""
        self.patent_id = patent_id
        self._fetch_data()

    def _get_access_token(self) -> str:
        """Get access token from EPO API."""
        consumer_key = os.getenv('CONSUMER_KEY')
        consumer_secret = os.getenv('CONSUMER_SECRET')

        if not consumer_key or not consumer_secret:
            raise ValueError('CONSUMER_KEY and CONSUMER_SECRET must be set in environment variables')

        token_url = 'https://ops.epo.org/3.2/auth/accesstoken'
        response = requests.post(token_url, data={'grant_type': 'client_credentials'}, auth=(consumer_key, consumer_secret))

        if response.status_code == HTTP_OK:
            token_data = response.json()
            return token_data['access_token']
        else:
            raise Exception(f'Error getting access token: {response.status_code} {response.text}')

    def _fetch_data(self) -> None:
        """Fetch patent data from EPO API."""
        self._initialize_fields()

        try:
            xml_data = self._get_patent_data()
            if xml_data:
                self._parse_xml_data(xml_data)
        except Exception as e:
            print(f'Warning: Failed to fetch patent data for {self.patent_id}: {e!s}')

    def _initialize_fields(self) -> None:
        """Initialize all fields with default empty values."""
        self.title = ''
        self.abstract = ''
        self.publication_date = ''
        self.applicants = []
        self.inventors = []

    def _clean_pattern_id(self, p: str) -> str:
        pattern = r'^([A-Z]+[0-9]+)'
        match = re.match(pattern, p)
        if match:
            return match.group(1)
        return p

    def _get_patent_data(self) -> str:
        """Fetch XML data from EPO API."""
        access_token = self._get_access_token()
        url = f'https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/{self._clean_pattern_id(self.patent_id)}/biblio'

        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(url, headers=headers)

        if response.status_code == HTTP_OK:
            return response.text
        else:
            raise Exception(f'Error {response.status_code}: {response.text}')

    def _parse_xml_data(self, xml_data: str) -> None:
        """Parse patent fields from XML data."""
        try:
            root = ET.fromstring(xml_data)

            # Find exchange-document using the correct namespace
            exchange_doc = root.find('.//{http://www.epo.org/exchange}exchange-document')
            if exchange_doc is None:
                return

            self._extract_title(exchange_doc)
            self._extract_abstract(exchange_doc)
            self._extract_publication_date(exchange_doc)
            self._extract_applicants(exchange_doc)
            self._extract_inventors(exchange_doc)

        except ET.ParseError as e:
            print(f'Error parsing XML data: {e!s}')
        except Exception as e:
            print(f'Error extracting patent data: {e!s}')

    def _extract_title(self, exchange_doc: ET.Element) -> None:
        """Extract title from XML, preferring English."""
        title_en = exchange_doc.find('.//{http://www.epo.org/exchange}invention-title[@lang="en"]')
        if title_en is not None:
            self.title = title_en.text or ''
        else:
            title_any = exchange_doc.find('.//{http://www.epo.org/exchange}invention-title')
            if title_any is not None:
                self.title = title_any.text or ''

    def _extract_abstract(self, exchange_doc: ET.Element) -> None:
        """Extract abstract from XML, preferring English."""
        abstract_en = exchange_doc.find('.//{http://www.epo.org/exchange}abstract[@lang="en"]/{http://www.epo.org/exchange}p')
        if abstract_en is not None:
            abstract_text = ET.tostring(abstract_en, encoding='unicode', method='text')
            self.abstract = abstract_text.strip()
        else:
            abstract_any = exchange_doc.find('.//{http://www.epo.org/exchange}abstract/{http://www.epo.org/exchange}p')
            if abstract_any is not None:
                abstract_text = ET.tostring(abstract_any, encoding='unicode', method='text')
                self.abstract = abstract_text.strip()

    def _extract_publication_date(self, exchange_doc: ET.Element) -> None:
        """Extract and format publication date from XML."""
        pub_date = exchange_doc.find(
            './/{http://www.epo.org/exchange}publication-reference/{http://www.epo.org/exchange}document-id/{http://www.epo.org/exchange}date'
        )
        if pub_date is not None:
            date_str = pub_date.text or ''
            if len(date_str) == DATE_FORMAT_LENGTH:
                self.publication_date = f'{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}'
            else:
                self.publication_date = date_str

    def _extract_applicants(self, exchange_doc: ET.Element) -> None:
        """Extract applicant names from XML."""
        applicants = exchange_doc.findall(
            './/{http://www.epo.org/exchange}applicants/{http://www.epo.org/exchange}applicant/{http://www.epo.org/exchange}applicant-name/{http://www.epo.org/exchange}name'
        )
        self.applicants = []
        for applicant in applicants:
            if applicant.text:
                name = self._clean_text(applicant.text)
                if name and name not in self.applicants:
                    self.applicants.append(name)

    def _extract_inventors(self, exchange_doc: ET.Element) -> None:
        """Extract inventor names from XML."""
        inventors = exchange_doc.findall(
            './/{http://www.epo.org/exchange}inventors/{http://www.epo.org/exchange}inventor/{http://www.epo.org/exchange}inventor-name/{http://www.epo.org/exchange}name'
        )
        self.inventors = []
        for inventor in inventors:
            if inventor.text:
                name = self._clean_text(inventor.text)
                if name and name not in self.inventors:
                    self.inventors.append(name)

    def _clean_text(self, text: str) -> str:
        """Clean text by removing Unicode whitespace characters and normalizing spaces."""
        # Remove various Unicode whitespace characters including \u2002 (EN SPACE)
        # This includes: EN SPACE, EM SPACE, THIN SPACE, HAIR SPACE, etc.
        text = re.sub(r'[\u2000-\u200B\u2028\u2029]', ' ', text)

        # Normalize multiple spaces to single space and strip
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    @property
    def authors(self) -> list[str]:
        """Alias for inventors to maintain compatibility with Document interface."""
        return self.inventors

    @property
    def institutions(self) -> list[str]:
        """Alias for applicants to maintain compatibility with Document interface."""
        return self.applicants

    def __str__(self) -> str:
        """String representation of the patent."""
        abstract_preview = (
            self.abstract[:ABSTRACT_PREVIEW_LENGTH] + '...' if len(self.abstract) > ABSTRACT_PREVIEW_LENGTH else self.abstract
        )
        return (
            f'Patent(\n'
            f"  id='{self.patent_id}',\n"
            f"  title='{self.title}',\n"
            f"  abstract='{abstract_preview}',\n"
            f"  publication_date='{self.publication_date}',\n"
            f'  inventors={self.inventors},\n'
            f'  applicants={self.applicants}\n'
            f')'
        )

    def __repr__(self) -> str:
        """Detailed string representation of the patent."""
        return f"Patent(id='{self.patent_id}', title='{self.title}')"


# Test code
# if __name__ == '__main__':
#     dotenv.load_dotenv()
#     print(Patent('KR102656056B1'))
