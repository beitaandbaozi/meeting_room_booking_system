import { Form, Input, Button } from 'antd'
import { useForm } from 'antd/es/form/Form';
import './index.css'
interface RegisterUser {
    username: string;
    nickName: string;
    password: string;
    confirmPassword: string;
    email: string;
    captcha: string;
}
const onFinish = (values: RegisterUser) => {
    console.log("onFinish", values)
}
export function Register() {
    // todo 创建form实例
    const [form] = useForm()
    // todo 发送验证码
    const sendCaptcha = () => {

    }
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