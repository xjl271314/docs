# 相同的树

- 2020.08.07

> 给定两个二叉树，编写一个函数来检验它们是否相同。如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。[原题描述](https://leetcode-cn.com/problems/same-tree/)

```php
/*  ----------------------------------------------------------------
 *  解题思路:
 *  如果两个树都为null 那么表示相等 
 *  如果其中一个为null 一个不为null 表示不相等
 *  如果两个树 都不为null 其中的val值相等的时候递归判断左值和右值 否则表示不相等
 *  运行时间 0 ms 内存消耗 14.6 MB
 *  ----------------------------------------------------------------
 */

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     public $val = null;
 *     public $left = null;
 *     public $right = null;
 *     function __construct($val = 0, $left = null, $right = null) {
 *         $this->val = $val;
 *         $this->left = $left;
 *         $this->right = $right;
 *     }
 * }
 */
class Solution {
    /**
     * @param TreeNode $p
     * @param TreeNode $q
     * @return Boolean
     */
    function isSameTree($p, $q) {
        if ($p == null && $q == null){
            return true;
        }
        if($p == null || $q == null){
            return false;
        }
        if ($p->val != $q->val){
            return false;
        }
        return $this->isSameTree($p->left,$q->left) && $this->isSameTree($p->right,$q->right);
    }
}
```

```js
/*  ----------------------------------------------------------------
 *  解题思路:
 *  如果两个树其中一个不存在 则判断全等
 *  如果两个树都存在 其中的val值相等的时候递归判断左值和右值 否则表示不相等
 *  此版本在严格模式的js下不能执行 
 *  运行时间 84 ms 内存消耗 37.7 MB
 *  ----------------------------------------------------------------
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    if(!p || !q){
        return p === q;
    }
    if(p.val !== q.val){
        return false;
    }
    return arguments.callee(p.left, q.left) && arguments.callee(p.right, q.right);
};
```

```python
# 运行时间 40 ms 内存消耗 13.6 MB
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p: TreeNode, q: TreeNode) -> bool:
        if p == None and q == None:
            return True
        if (p != None and q == None) or (p == None and q != None)  :
            return False
        if p.val != q.val:
            return False
        return self.isSameTree(p.left,q.left) and self.isSameTree(p.right,q.right)
```