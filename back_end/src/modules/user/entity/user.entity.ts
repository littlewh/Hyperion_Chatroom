import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  // 使用uuid生成主键,使用PrimaryGeneratedColumn装饰器
  @PrimaryGeneratedColumn('uuid')
  userId: string

  @Column({ default: 'test' })
  username: string

  @Column({ default: '2313722687@qq.com' })
  email: string

  @Column({ default: '123456', select: false })
  password: string

  @Column({ default: 'avatar1.png' })
  avatar: string

  //权限
  @Column({ default: 'user' })
  role: string

  //用户状态
  @Column({ default: 'on' })
  status: string

  //备注
  @Column({ default: '' })
  tag: string

  @Column({ type: 'double', default: new Date().valueOf() })
  createTime: number
}
