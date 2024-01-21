import { Form, Input, Button } from 'antd';
import './index.css'

interface LoginUser {
    username: string,
    password: string
}

const onFinish = (values: LoginUser) => {
    console.log("onFinish", values)
}
export function Login() {
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
                    <a href="/">创建账号</a>
                    <a href="/">忘记密码</a>
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