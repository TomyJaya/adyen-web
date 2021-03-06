import { mount } from 'enzyme';
import { h } from 'preact';
import CountryField from './CountryField';
import getDataset from '~/utils/fetch-json-data';

jest.mock('~/utils/fetch-json-data');
const countriesMock = [
    {
        id: 'BR',
        name: 'Brazil'
    },
    {
        id: 'NL',
        name: 'Netherlands'
    },
    {
        id: 'SG',
        name: 'Singapore'
    },
    {
        id: 'US',
        name: 'United States'
    }
];

getDataset.mockImplementation(jest.fn(() => Promise.resolve(countriesMock)));

describe('CountryField', () => {
    const getWrapper = props => mount(<CountryField {...props} />);

    test('calls getDataset', () => {
        const wrapper = getWrapper();
        expect(getDataset).toHaveBeenCalled();
    });

    test('loads countries', async () => {
        const wrapper = await getWrapper();
        wrapper.update();
        expect(wrapper.find('li[data-value]')).toHaveLength(4);
    });

    test('only loads the allowed countries ', async () => {
        const allowedCountries = ['US', 'NL'];
        const wrapper = await getWrapper({ allowedCountries });
        wrapper.update();
        expect(wrapper.find('li[data-value]')).toHaveLength(2);
    });

    test('preselects the passed country', async () => {
        const value = 'NL';
        const wrapper = await getWrapper({ value });
        wrapper.update();
        expect(wrapper.find('SelectBox').prop('selected')).toBe(value);
    });

    test('should be read only if there is only one item', async () => {
        const allowedCountries = ['NL'];
        const value = 'NL';
        const wrapper = await getWrapper({ value, allowedCountries });
        wrapper.update();
        expect(wrapper.find('SelectBox').prop('readonly')).toBe(true);
    });
});
