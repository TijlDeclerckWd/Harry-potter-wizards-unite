import {ChatComponent} from './chat.component';

describe('chat component', () => {
  it('should change the status of the checkbox', function () {
    let component = new ChatComponent( null, null);
    component.checkboxChecked = false;

    component.changeCheckboxStatus();

    expect(component.checkboxChecked).toBe(true);
  });
})
