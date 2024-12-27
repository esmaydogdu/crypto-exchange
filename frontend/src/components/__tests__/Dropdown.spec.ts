import { mount } from '@vue/test-utils';
import { Dropdown } from '@/components';
import { nextTick } from 'vue';
import { describe, it, expect, vi } from 'vitest';

describe('Dropdown.vue', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  it('renders dropdown with options when provided', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        modelValue: '',
        options: options,
      },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.findAll('.dropdown-item').length).toBe(options.length);
  });

  it('shows the placeholder when no option is selected', () => {
    const wrapper = mount(Dropdown, {
      props: {
        modelValue: '',
        options: options,
      },
    });

    const button = wrapper.find('button');
    expect(button.text()).toBe('Select ▼');
  });

  it('shows the selected label when an option is selected', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        modelValue: 'option2',
        options: options,
      },
    });

    const button = wrapper.find('button');
    expect(button.text()).toBe('Option 2 ▼');
  });

  it('toggles the dropdown when the button is clicked', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        modelValue: '',
        options: options,
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);

    await button.trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });

  it('selects an option and updates modelValue', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        modelValue: 'option1',
        options: options,
      },
      emit: ['update:modelValue'],
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    await nextTick();
    const option = wrapper.findAll('.dropdown-item a')[1]; 
    await option.trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['option2']);
    
    // TODO test env is not updating this automatically
    await wrapper.setProps({
      modelValue: 'option2',
    })
    expect(wrapper.find('button').text()).toBe('Option 2 ▼');
  });

  it('closes the dropdown when clicked outside', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        modelValue: 'option1',
        options: options,
      }
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    await nextTick();
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);

    // click outside
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
  });
});
