[toc]
#### 创建个人信息
```git
git config --global user.name "用户名"  //设置全局用户名
git config --global user.email   "用户邮箱" //设置全局用户邮箱
git config -l //查看相关个人设置信息
```

#### 初始化当前目录
```git
git init
git init 项目名称
```

#### 版本回退（撤回仓库分支中的提交）
```git
git reset --hard 版本ID 回退到指定的版本状态
git reset --hard HEAD^  直接回退到上一个版本
git reset --hard HEAD^^ 回退到上上个版本
```

#### 撤回暂存区里的内容
```git
git reset HEAD 文件名 撤回暂存区里指定的文件
git reset HEAD .  撤回暂存区里所有的文件
```

#### 如果没设置.gitignore不小心上传了一些不想上传的东西可以删除掉
```
git rm --cached 文件名
```

#### 查看当前仓库的提交日志
```git
git log 查看当前仓库中所有的提交日志（只能展示部分）
git reflog  对所有提交的版本日志进行查询
git log -pretty=oneline 查看日志时，只显示唯一的提交ID和提交信息
```

#### 克隆仓库的相关操作
```git
git clone 远程仓库地址  //克隆远程仓库
git clone -b 远程的分支名 远程仓库地址  //克隆远程仓库中指定的分支仓库
```

#### 首次将本地仓库提交到远程仓库
```git
git remote add origin 远程库地址  //把本地库与远程库关联
git push -u origin master //第一次推送时
git push origin master  //第一次推送后，直接使用该命令即可推送修改
```

#### 分支相关
```git
git checkout -b 分支名  //创建一个分支，并切换到当前分支来
git branch  //查看当前所有分支情况，还可以看到当前所处的分支
git checkout 分支名 //切换分支
git branch -d 分支名  //删除分支（要删除该分支，就得在其他分支上进行操作，不能在该分支上删除自己，而且没合并分支前，只能强制性删除，否则该方法删不掉）
git branch -D 分支名  //强制删除分支 
git merge 分支名  //合并分支操作
git merge --abort   // 回到merge之前的状态，取消merge
```

#### 提交代码的注释
```git
feat  //修改/增加新功能
fix //修改bug的变更
docs  //文档相关变更
style //不影响代码含义的变更(空白、格式、缺少符号等)
refactor  //代码重构变更
perf  //改进性能的变更
test  //添加/修改现有的测试
chore //Build, .gitignore或辅助工具、库(如文档生成)等变更
```

#### stash解决代码冲突
```git
git stash       //先将本地的改动暂存起来（本地相当于没做任何改动）
git pull        //再拉取远程代码
git stash pop   //将本地的之前改动的暂存释放出来，这样就解决了代码冲突问题
```
