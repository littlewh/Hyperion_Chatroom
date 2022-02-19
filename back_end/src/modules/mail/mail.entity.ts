import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Mail {
  // 使用uuid生成主键,使用PrimaryGeneratedColumn装饰器
  @PrimaryGeneratedColumn('uuid')
  userId: string

  @Column({ default: 'test' })
  username: string

  @Column({ default: '123456', select: false })
  password: string

  @Column({ default: '2313722687@qq.com' })
  email: string

  @Column({ default: '123456' })
  code: string

  @Column({ type: 'double', default: new Date().valueOf() })
  time: number
}
