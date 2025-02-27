import React from 'react';

import { Text, Form, Title } from '@patternfly/react-core';

import NtpServersInput from './components/NtpServersInput';
import TimezoneDropDown from './components/TimezoneDropDown';

const TimezoneStep = () => {
  return (
    <Form>
      <Title headingLevel="h1" size="xl">
        Timezone
      </Title>
      <Text>Select a timezone for your image.</Text>
      <TimezoneDropDown />
      <NtpServersInput />
    </Form>
  );
};

export default TimezoneStep;
