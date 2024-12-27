import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components';

describe('Button.vue', () => {
  it('renders with label and not disabled by default', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Test button'
      },
    });

    const button = wrapper.find('button')

    expect(button.text()).toBe('Test button');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('updates rendered label based on prop change', async () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Initial value',
      },
    });

    // Check initial value in the input
    const button = wrapper.find('button');
    expect(button.text()).toBe('Initial value');

    // Update modelValue prop and check if internalValue updates
    await wrapper.setProps({ label: 'Updated value' });
    expect(button.text()).toBe('Updated value');
  });

  
  it('renders disables button', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Label',
        isDisabled: true
      },
    });

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBe('')
  });
});
