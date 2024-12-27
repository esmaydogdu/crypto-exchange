import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '@/components';

describe('Input.vue', () => {
  it('renders with placeholder and label', () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: 'Enter text',
        label: 'Test Label',
        modelValue: 'Initial value',
      },
    });

    expect(wrapper.find('.label').text()).toBe('Test Label');

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('Enter text');
  });

  it('updates rendered value based on prop change', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'Initial value',
      },
    });

    // Check initial value in the input
    const input = wrapper.find('input');
    expect(input.element.value).toBe('Initial value');

    // Update modelValue prop and check if internalValue updates
    await wrapper.setProps({ modelValue: 'Updated value' });
    expect(input.element.value).toBe('Updated value');
  });

  it('emits update:modelValue when input changes', async () => {
    const emitSpy = vi.fn();
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
      },
      global: {
        config: {
          globalProperties: {
            emit: emitSpy,
          },
        },
      },
    });

    // Change input
    const input = wrapper.find('input');
    await input.setValue('New Value');

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['New Value']);
  });

  it('renders without label if not provided', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'Initial value',
      },
    });

    expect(wrapper.find('.label').exists()).toBe(false);
  });
});
