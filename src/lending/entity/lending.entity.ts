import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lending {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 1 })
  rank: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'int', default: 0 })
  deposit: number;

  @Column({ type: 'int', default: 0 })
  borrow: number;

  @Column({ type: 'int', default: 0 })
  referral: number;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column({ type: 'varchar', default: '' })
  referralLink: number;
}
