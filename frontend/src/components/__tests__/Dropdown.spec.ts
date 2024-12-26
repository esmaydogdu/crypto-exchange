import { describe, it, expect, beforeAll } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import Dropdown from '@/components/Dropdown.vue';

let wrapper: VueWrapper;

beforeAll(() => {
  wrapper = mount(Dropdown, {
    props: {
      label: 'Test Label',
      options: [ 1, 2, 3 ],
      modelValue: 1
    }
  });
});

describe('Dropdown.vue', () => {

  it('renders the label correctly', () => {
    const label = wrapper.find('label');
    expect(label.text()).toBe('Test Label');
  });

  it('renders the correct number of options', () => {
    const options = wrapper.findAll('option');
    expect(options.length).toBe(3);
    expect(options[0].text()).toBe('1');
    expect(options[1].text()).toBe('2');
    expect(options[2].text()).toBe('3');
  });

  it('sets the default selected value correctly', () => {
    const select = wrapper.find('select');
    expect(select.element.value).toBe('1');
  });

  it('emits "update:modelValue" when the selection changes', async () => {
    const select = wrapper.find('select');
    await select.setValue(2);

    const emittedValue = wrapper.emitted('update:modelValue')?.[0];
    expect(emittedValue).toEqual([2]);
  });

  it('updates dynamically when props change', async () => {
    await wrapper.setProps({
      options: [
       1, 2
      ]
    });

    const options = wrapper.findAll('option');
    expect(options.length).toBe(2);
    expect(options[0].text()).toBe('1');
    expect(options[1].text()).toBe('2');
  });
});