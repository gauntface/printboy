import {OnLoad} from './utils/_onload';

const CLASSNAMES = {
	TAB_VISIBLE: 'l-tabs__content--visible',
	TAB_ACTIVE: 'drac-tab-active',
};

class Tabs {
	private _tabsContainer: Element;
	private _tabsContentsContainer: Element;

	constructor(tabsContainer: Element) {
		this._tabsContainer = tabsContainer;
		const tabContents = document.querySelector(`[name="${tabsContainer.getAttribute('for')}"]`);
		if (!tabContents) {
			console.warn(`Failed to find tab contents:`);
			console.warn(tabsContainer);
			console.warn(`name: ${tabsContainer.getAttribute('for')}`);
			throw Error('Failed to find tab contents');
		}
		this._tabsContentsContainer = tabContents;

		const tabs = tabsContainer.querySelectorAll('.js-tab');
		if (tabs.length == 0) {
			return;
		}

		for (const tab of tabs) {
			tab.addEventListener('click', (e) => {
				this.selectTab(e.target);
			});
		}

		this.selectTab(tabs[0]);
	}

	selectTab(tab) {
		const vistabcontents = this._tabsContentsContainer.querySelectorAll(`.${CLASSNAMES.TAB_VISIBLE}`);
		for (const t of vistabcontents) {
			t.classList.remove(CLASSNAMES.TAB_VISIBLE);
		}
		const vistabs = this._tabsContainer.querySelectorAll(`.${CLASSNAMES.TAB_ACTIVE}`);
		for (const t of vistabs) {
			t.classList.remove(CLASSNAMES.TAB_ACTIVE);
		}

		const tabContent = this._tabsContentsContainer.querySelector(`[name="${tab.getAttribute('for')}"]`);
		if (!tabContent) {
			console.warn(`Failed to find tab content:`);
			console.warn(tab);
			console.warn(`name: ${tab.getAttribute('for')}`);
			throw Error('Failed to find tab content');
		}
		tabContent.classList.add(CLASSNAMES.TAB_VISIBLE);
		tab.parentElement?.classList.add(CLASSNAMES.TAB_ACTIVE);
	}
}

OnLoad(() => {
	const tabs = document.querySelectorAll('.js-tabs');
	for (const t of tabs) {
		new Tabs(t);
	}
});
