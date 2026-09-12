import { useState } from 'react'
import {login} from './api/login'
import http from './api/request.js'
function App() {
	//loading代表登录状态 loading===true 代表登录提交
	// loading 表示登录请求是否正在处理中
    const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [password ,setPassword] = useState('')
	const [message,setMessage] = useState('')
	//展示邮箱之变量
	const [savedEmail,setSavedEmail] = useState(()=>{
		if(localStorage.getItem('user')){
			return JSON.parse(localStorage.getItem('user')).email
		}else{
			return ''
		}
		
	})
	//method
	async function handleSubmit(event){
		event.preventDefault()
		// console.log(email,password);
		setLoading(true)
		setMessage('')
		try{
        	const res = await login(email,password)
			console.log(res.data);
			if(res.code === 0){
			    console.log(res.code);
			    // setMessage是提示客户的
				localStorage.setItem('token', res.data.token)
				localStorage.setItem('user',JSON.stringify(res.data.user))
				// console.log(JSON.parse(localStorage.getItem('user')).email);
				//登录成功从后端拉取
		        setMessage(res.message);
				//登录成功本地拉取
				setSavedEmail(JSON.parse(localStorage.getItem('user')).email)
			}else{
				//走别的逻辑
				setMessage('注册？')
			}
		}
		catch (error) {
			// console.error('登录请求失败');
			console.log(error.response);
			setMessage(error.response?.data?.message ?? "请求失败，请稍后重试");
		}
		finally{
			setLoading(false)
		}
	}
	//退出登录
	function handleLogout(){
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		setSavedEmail('')
	}
	//// 通过 http 请求测试接口；有缓存 token 时，请求拦截器会自动添加认证头
	//下面函数是把token加到头
	async function checkToken(){
		//通过http发送请求 这样就携带头
		try {
		const result = await http.get('/check-token') 
		console.log(result);			
		} catch (error) {
			console.log(error);
		}

	}
  return (
    <>
	<form  onSubmit={handleSubmit}>
	<h1>邮箱输入框</h1>
	<input type="email"  placeholder='请输入邮箱' value={email}  onChange={(event)=>setEmail(event.target.value)} required/>
	<h1>密码输入框</h1>
	<input type="password" placeholder='请输入密码' value={password} onChange={(event)=>setPassword(event.target.value)} required/>
	<button type='submit' disabled={loading}>{loading===true?'提交中':'提交'}</button>
	<p>{message}</p>
	<p>保存的邮箱：{savedEmail}</p>
	<button type='button' onClick={handleLogout} disabled={loading}>{loading===true?'登录中':'退出登录'}</button>
	</form>
	<button type='button' onClick={checkToken}>{'检查token是否传递3001/checktoken'}</button>
    </>
  )
}

export default App
