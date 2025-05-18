// 这是一个故意包含多种问题的服务类
import { Injectable } from '@nestjs/common';

// 没有正确使用接口
class userdata {
  name: string;
  Age: number;
  EMAIL: string;
  is_active: boolean;
}

@Injectable()
export class BuggyService {
  // 使用any类型
  private users: any[] = [];
  private static instance: BuggyService;
  
  // 未使用的参数
  constructor(private readonly logger: any, unusedParam: string) {
    console.log("Service initialized");
    // 直接在构造函数中执行副作用
    this.fetchAllData();
  }
  
  // 单例模式实现错误
  public static getInstance() {
    if (!BuggyService.instance) {
      BuggyService.instance = new BuggyService(null, "");
    }
    return BuggyService.instance;
  }
  
  // 使用Promise但没有处理错误
  async fetchAllData() {
    const data = await fetch('https://api.example.com/users');
    this.users = await data.json();
    return this.users;
  }
  
  // 变量命名不一致，混合使用驼峰和下划线
  getUserById(User_id: number) {
    // 使用==而不是===
    return this.users.find(user => user.id == User_id);
  }
  
  // 返回类型不明确
  getAllActiveUsers() {
    var active_users = [];
    
    // 使用for循环而不是filter
    for(var i = 0; i < this.users.length; i++) {
      if(this.users[i].is_active == true) {
        active_users.push(this.users[i]);
      }
    }
    
    return active_users;
  }
  
  // 方法太长，做了太多事情
  processUserData(userData: userdata) {
    // 魔法数字
    if(userData.Age < 18) {
      console.log("User is too young");
      return { success: false, error: "User is too young" };
    }
    
    // 字符串拼接而不是模板字符串
    console.log("Processing user: " + userData.name + " with email " + userData.EMAIL);
    
    // 重复代码
    let formattedName = userData.name.trim().toLowerCase();
    if(formattedName.length < 2) {
      return { success: false, error: "Name is too short" };
    }
    
    let formattedEmail = userData.EMAIL.trim().toLowerCase();
    if(formattedEmail.length < 5) {
      return { success: false, error: "Email is too short" };
    }
    
    if(!formattedEmail.includes("@")) {
      return { success: false, error: "Invalid email format" };
    }
    
    // 不必要的嵌套if语句
    if(userData.is_active) {
      if(userData.Age > 18) {
        if(userData.name.length > 0) {
          // 添加到数组中，但没有检查重复
          this.users.push({
            name: formattedName,
            age: userData.Age,
            email: formattedEmail,
            isActive: userData.is_active,
            // 时间戳使用不安全的Date.now()
            createdAt: Date.now()
          });
          
          return { success: true };
        }
      }
    }
    
    return { success: false, error: "Unknown error" };
  }
  
  // 不一致的命名约定 (deleteUser vs removeUserById)
  deleteUser(id: number) {
    // 直接修改数组而不是创建新数组
    this.users = this.users.filter(u => u.id !== id);
  }
  
  // 另一个类似的功能但有不同的命名
  removeUserById(userId: number) {
    const index = this.users.findIndex(u => u.id === userId);
    if(index >= 0) {
      this.users.splice(index, 1);
    }
  }
  
  // 过度暴露实现细节
  public get rawUserData() {
    return this.users;
  }
  
  // 在同步方法中返回Promise
  updateUser(user: userdata, id: number) {
    const index = this.users.findIndex(u => u.id === id);
    
    return new Promise((resolve, reject) => {
      if(index >= 0) {
        // 直接修改对象而不是创建新对象
        this.users[index].name = user.name;
        this.users[index].age = user.Age;
        this.users[index].email = user.EMAIL;
        this.users[index].isActive = user.is_active;
        
        resolve(this.users[index]);
      } else {
        reject("User not found");
      }
    });
  }
  
  // 不必要的复杂函数和嵌套循环
  findUsersByAgeRange(minAge: number, maxAge: number) {
    let result = [];
    
    for(let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      
      for(let j = 0; j < this.users.length; j++) {
        // 无意义的二重循环
        if(i === j) {
          if(user.age >= minAge && user.age <= maxAge) {
            result.push(user);
            break;
          }
        }
      }
    }
    
    return result;
  }
}

// 导出默认实例而不是类
export default BuggyService.getInstance();
