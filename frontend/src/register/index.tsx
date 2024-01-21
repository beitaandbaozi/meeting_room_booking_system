import { Form, Input, Button, message } from 'antd'
import { useForm } from 'antd/es/form/Form';
import './index.css'
import { register, registerCaptcha } from '../interfaces';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
export interface RegisterUser {
    username: string;
    nickName: string;
    password: string;
    confirmPassword: string;
    email: string;
    captcha: string;
}
export function Register() {
    // todo 创建form实例
    const [form] = useForm()
    const navigate = useNavigate()
    // todo 发送验证码
    // todo useCallback 减少不必要渲染的一种性能优化
    const sendCaptcha = useCallback(async () => {
        const address = form.getFieldValue('email')
        if (!address) {
            return message.error('请输入邮箱地址');
        }
        const res = await registerCaptcha(address);
        if (res.status === 201 || res.status === 200) {
            message.success(res.data.data);
        } else {
            message.error(res.data.data || '系统繁忙，请稍后再试');
        }
    }, [])
    // todo 注册
    const onFinish = useCallback(async (values: RegisterUser) => {
        if (values.password !== values.confirmPassword) {
            return message.error('两次密码不一致');
        }
        const res = await register(values);
        if (res.status === 201 || res.status === 200) {
            message.success('注册成功');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else {
            message.error(res.data.data || '系统繁忙，请稍后再试');
        }
    }, []);
    return (<div className="register-container">
        <h1 className='title'>会议室预订系统</h1>
        <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            colon={false}
            autoComplete='off'
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="昵称"
                name="nickName"
                rules={[{ required: true, message: '请输入昵称!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="确认密码"
                name="confirmPassword"
                rules={[{ required: true, message: '请输入确认密码!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="邮箱"
                name="email"
                rules={[
                    { required: true, message: '请输入邮箱!' },
                    { type: "email", message: '请输入合法邮箱地址!' }
                ]}
            >
                <Input />
            </Form.Item>
            <div className='captcha-wrapper'>
                <Form.Item
                    label="验证码"
                    name="captcha"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary" className='btn-captcha' onClick={sendCaptcha}>发送验证码</Button>
            </div>
            <Form.Item
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
            >
                <div className='links'>
                    已有账号？去<a href=''>登录</a>
                </div>
            </Form.Item>

            <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label=" "
            >
                <Button className='btn' type="primary" htmlType="submit">
                    注册
                </Button>
            </Form.Item>
        </Form>
    </div >)
}