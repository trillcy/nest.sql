import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async deleteAll() {
    const result = await this.dataSource.query(`DELETE FROM public."Devices";`);
    return result;
  }
}
