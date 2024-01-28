import { Form, Input, Button, message } from 'antd';
import './index.css'
import { login } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface LoginUser {
    username: string,
    password: string
}


export function Login() {
    const navigate = useNavigate()
    // todo 登录
    const onFinish = useCallback(async (values: LoginUser) => {
        const res = await login(values.username, values.password)
        const { code, message: msg, data } = res.data
        if (code === 201 || code === 200) {
            message.success(msg)
            localStorage.setItem('access_token', data.accessToken)
            localStorage.setItem('refresh_token', data.accessToken)
            localStorage.setItem('user_info', JSON.stringify(data.userInfo))
            setTimeout(() => {
                navigate('/')
            }, 1000)
        } else {
            message.error(data || '系统繁忙，请稍后再试😵‍💫')
        }
    }, [])
    return (<div className='login-container'>
        <h1 className='title'>会议室预订系统</h1>
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
            colon={false}
            autoComplete='off'
        >
            {/* 用户名 */}
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input />
            </Form.Item>
            {/* 密码 */}
            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
            >
                <div className='links'>
                    <a href="/register">创建账号</a>
                    <a href="/update-password">忘记密码</a>
                </div>
            </Form.Item>
            <Form.Item
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}>
                <Button type="primary" className='btn' htmlType='submit'>登录</Button>
            </Form.Item>
        </Form>
    </div>)
}