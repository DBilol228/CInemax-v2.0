from collections import Counter
from html.parser import HTMLParser


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.classes = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        self.classes.extend(attributes.get("class", "").split())


def test_frontend_and_assets_are_served(cinema):
    client = cinema["client"]
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert '/static/script.js' in response.text
    assert '/static/style.css' in response.text
    page = PageParser()
    page.feed(response.text)
    assert all(count == 1 for count in Counter(page.ids).values())
    assert {"header", "main", "footer", "modal-root", "toasts", "curtains"}.issubset(page.ids)
    assert {"curtain", "left", "right", "curtain-logo"}.issubset(page.classes)

    for asset in [
        "script.js", "style.css", "assets/hero.svg", "assets/mark.svg",
        "assets/poster-orbit.svg", "assets/poster-noir.svg", "assets/poster-dunes.svg",
    ]:
        assert client.get("/static/" + asset).status_code == 200


def test_api_docs_still_expose_all_28_endpoints(cinema):
    schema = cinema["client"].get("/openapi.json").json()
    methods = {"get", "post", "patch", "delete", "put"}
    operations = [method for path in schema["paths"].values() for method in path if method in methods]
    assert len(operations) == 28
    assert "/api/v1/users" in schema["paths"]
