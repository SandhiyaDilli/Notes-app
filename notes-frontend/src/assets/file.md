1.Component:
  Elemenets / blocks in a web page.

2.Props:
 # It is just input parameter to the componenet function.
 # We do have deafultProps to handle if the prop is not given.

3.Conditional Rendering:
  # The page would rendered if and only if the given condition is satisfied.
  # Used in auth and login.

4.Hooks:
  # hooks are react's special function / method.

5.useState:
  #  it is hook.
  #  used to change a local variable to state variable.
  # It is not a void fun.

6.Destructor:
  # This useState() will return a arraylist so we store the items in an array and this array is called destructor.
   
  like this:
  const a[state_variable,set_state_variable(setter method)] = useState(value to store in state_variable);
  set_state_variable(new value for state_variable);

7.useEffect:
  # It is also a hook.
  # Void fun.
  # Whenever the components are rendered in the web page then the fun written inside this hook also run. 
  # state variables can be accessed inside useEffect.But never try to access setter method of the useState variable.It will end up in infinte loop.

8.<StrictMode></StrictMode>:
  # Used when a project is in development phase(unlike production phase).Becoz of this react rechecks every component so the fun inside the useEffect is runned twice.

props,component state if any of these gets changed react need to re-render it.
mostly props will not bring change becoz they are inside the component.