function login(email,password){
	return new Promise((resolve)=>(setTimeout(()=>
	{resolve(
		{
  code: 0,
  message: "登录成功",
  data: {
    token: "fake-token",
    user: {
      email,
    },
  },
}
	)
	console.log('发送ing');
	}
	,2000)))
}

export {login}  
