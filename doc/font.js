const { default: fonts } = _fontList;
const { FontList } = _modulesDev;

const BaseExample = () => {
  return <FontList fonts={fonts} />;
};

render(<BaseExample />);
