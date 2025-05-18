import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BuggyService } from './buggy-service';

// 缺少参数类型定义的DTO
class CreateUserDto {
  name;
  Age;
  EMAIL;
  is_active;
}

@Controller('users')
export class BuggyController {
  // 依赖注入错误 - 注入默认导出而不是类
  constructor(private readonly buggyService: any) {}

  // 不一致的错误处理策略
  @Get()
  async findAll() {
    try {
      return await this.buggyService.fetchAllData();
    } catch (error) {
      // 直接返回错误对象，没有格式化
      return error;
    }
  }

  // 路径参数命名不一致
  @Get(':id')
  async findOne(@Param('id') userId: string) {
    // 没有错误处理
    // 没有类型转换 - 参数始终是字符串
    return this.buggyService.getUserById(userId);
  }

  // 没有验证请求体
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      // 调用了一个不明确的方法
      return await this.buggyService.processUserData(createUserDto);
    } catch (err) {
      // 错误处理不一致
      return {
        status: 'error',
        message: err.toString()
      };
    }
  }

  // 重复的路由处理器
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    // 不安全的类型转换
    return await this.buggyService.updateUser(updateUserDto, parseInt(id));
  }

  // 仅用于一个特定ID的端点
  @Put('special/1')
  async updateSpecialUser(@Body() updateUserDto: CreateUserDto) {
    // 硬编码ID
    return await this.buggyService.updateUser(updateUserDto, 1);
  }

  // 不一致的命名约定 (remove vs delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // 不返回任何响应
    this.buggyService.deleteUser(parseInt(id));
  }

  // 返回过多信息
  @Get('debug/all')
  getAllRawData() {
    // 暴露内部实现细节
    return {
      data: this.buggyService.rawUserData,
      serviceInstance: this.buggyService,
      env: process.env
    };
  }

  // 有安全漏洞的端点
  @Post('admin/execute')
  executeCommand(@Body() command: { cmd: string }) {
    // 执行任意代码(模拟)
    try {
      console.log(`Would execute: ${command.cmd}`);
      return { success: true, result: `Executed: ${command.cmd}` };
    } catch(e) {
      return { success: false, error: e.message };
    }
  }

  // 混合使用异步和同步代码
  @Get('active')
  getActiveUsers() {
    // 同步方法但模拟异步响应格式
    const users = this.buggyService.getAllActiveUsers();
    return Promise.resolve({ data: users });
  }
}
