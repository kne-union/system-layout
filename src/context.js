import { createContext, useContext as useReactContext } from 'react';

const context = createContext({});

export const useContext = () => {
  return useReactContext(context);
};

export const { Provider, Consumer } = context;

export default context;
