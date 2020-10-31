# 两数相加

- 2020.10.27

> 给出两个非空的链表用来表示两个非负的整数。其中，它们各自的位数是按照逆序的方式存储的，并且它们的每个节点只能存储一位数字。如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。您可以假设除了数字 0 之外，这两个数都不会以 0 开头。[原题描述](https://leetcode-cn.com/problems/add-two-numbers/)

**示例:**

```bash
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8

原因：342 + 465 = 807
```

## 解法

```js
/**
 * ----------------------------------------------------------------
 * 解题思路:
 * 由于输入的两个链表都是逆序存储数字的位数的，因此两个链表中同一位置的数字可以直接相加。
 * 我们同时遍历两个链表，逐位计算它们的和，并与当前位置的进位值相加。
 * 具体而言，如果当前两个链表处相 应位置的数字为 n1,n2，进位值为  carry，则它们的和为 n1+n2+carry；
 * 其中，答案链表处相应位置的数字为 (n1+n2+carry)%10，而新* 的进位值为 n1+n2+carry / 10。
 * 时间复杂度：O(\max(m,n))O(max(m,n))，其中 m,nm,n 为两个链表的长度。我们要遍历两个链表的全部位置，而处理每个位置只需要 O(1)O(1) 的时间。
 * 空间复杂度：O(\max(m,n))O(max(m,n))。答案链表的长度最多为较长链表的长度 +1+1。
 * 运行时间 196 ms 内存消耗 43.3 MB
 * ----------------------------------------------------------------
 * 
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 *
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    let head = null, tail = null;
    let carry = 0;
    while (l1 || l2) {
        const n1 = l1 ? l1.val : 0;
        const n2 = l2 ? l2.val : 0;
        const sum = n1 + n2 + carry;
        if (!head) {
            head = tail = new ListNode(sum % 10);
        } else {
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
        }
        carry = Math.floor(sum / 10);
        if (l1) {
            l1 = l1.next;
        }
        if (l2) {
            l2 = l2.next;
        }
    }
    if (carry > 0) {
        tail.next = new ListNode(carry);
    }
    return head;
};
```


