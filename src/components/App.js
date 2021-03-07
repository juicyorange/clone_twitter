import React, { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  // firebase가 currentUser를 초기화하는데 시간이 걸린다.
  // 그래서 currentUser를 바로 출력해보면 null 이라고 표시된다.
  // 그러니 init state를 통해 firebase가 초기화되고 다음 작업을 수행할 수 있도록 해주자.

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // userObj를 제일 상단인 App.js에 놓은것은 하위의 다른 것들이 이것을 필요로 할수 있기 떄문이다.

  useEffect(() => {
    // 페이지에 처음 들어오고 auth에 변화가 있을때 init값을 변경해줌으로써 로그인이 되도록 한다. 변화가 없다면 자동로그인 x
    // 그 결과 null이라고 표시되지 않고, 로그인했던 유저의 정보로 로그인되게 된다. 
    // create or login or 이미 로그인 되있는 경우 firebase 유저 초기화가 끝나고 null이 아닌
    // 유저정보를 주기 때문에 여기서 초기화가 끝났는지 확인하고 그것에 따라 동작하도록 해준다
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          // firebase에서 함수를 가져오기 위해 그냥 일반 함수의 형태만 적어준다.
          // 이것을 통해 함수를 받을 수 있다. 
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  // 여기서 userObj 가 바뀌었다고 해주면 App의 유저 정보가 바뀌는 것이기 때문에
  // 아래에 있는 컴포넌트 들이 모두 바뀐다.
  // 이것을 profile에서 호출할것인데 이것은 App의 함수이고 유저정보는 App이 제일 상단이기 때문에
  // 자동으로 그 아래의 모든 userObj를 사용하는 컴포넌트들이 리렌더링 되게 된다. 
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "initializing...."}
      <footer>&copy; {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
