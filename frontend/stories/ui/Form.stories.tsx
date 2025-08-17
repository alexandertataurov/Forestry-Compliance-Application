import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

type FormValues = { email: string };

const DemoForm = () => {
  const form = useForm<FormValues>({ defaultValues: { email: '' } });
  const onSubmit = form.handleSubmit((values) => alert(JSON.stringify(values)));

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

const meta: Meta<typeof DemoForm> = {
  title: 'UI/Form',
  component: DemoForm,
};

export default meta;
type Story = StoryObj<typeof DemoForm>;

export const Basic: Story = { render: () => <DemoForm /> };

