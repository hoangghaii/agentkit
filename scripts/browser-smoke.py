#!/usr/bin/env python3
"""Verify a local UI by waiting for specific states, with no network-idle heuristic."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

with sync_playwright() as tool:
    options = {'headless': True}
    if os.environ.get('BROWSER_EXECUTABLE'):
        options['executable_path'] = os.environ['BROWSER_EXECUTABLE']
    browser = tool.chromium.launch(**options)
    try:
        page = browser.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(os.environ.get('TEST_URL', 'http://127.0.0.1:8765'), wait_until='domcontentloaded')
        expect(page.get_by_role('main')).to_be_visible()
        page.get_by_role('button', name='Save', exact=True).click()
        expect(page.get_by_role('status')).to_have_text('Saved')
        expect(page.get_by_role('status')).to_be_visible()
        assert not errors, errors
        output = Path(os.environ.get('BROWSER_OUTPUT', '/tmp/agentkit-browser-smoke.png'))
        page.screenshot(path=str(output))
        print(json.dumps({'ok': True, 'state': 'Saved', 'consoleErrors': errors, 'screenshot': str(output)}))
    finally:
        browser.close()
