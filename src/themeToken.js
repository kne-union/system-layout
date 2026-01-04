import merge from 'lodash/merge';
import transform from 'lodash/transform';

const transparentBgContainer = { colorBgContainer: 'transparent' };
const transparentBgContainerComponents = ['Input', 'InputNumber', 'Card', 'Tree', 'Select', 'DatePicker'];

const themeToken = {
  components: merge(
    {},
    transform(
      transparentBgContainerComponents,
      (result, component) => {
        result[component] = transparentBgContainer;
      },
      {}
    )
  )
};

export default themeToken;
