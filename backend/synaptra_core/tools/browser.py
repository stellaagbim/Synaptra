import webbrowser


def open_url(url: str) -> str:
    """
    Placeholder for a real browser automation tool.
    Right now it just opens the URL; later we replace with Playwright/Selenium.
    """
    webbrowser.open(url)
    return f"Opened URL: {url}"
