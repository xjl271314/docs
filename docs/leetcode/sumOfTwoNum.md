# 两数之和

- 2020.09.15

> 给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。[原题描述](https://leetcode-cn.com/problems/two-sum/)

## 示例:

```bash
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

## 解法:

- 双层遍历,购造剩余数组

```js
/*  ----------------------------------------------------------------
 *  解题思路:
 *  题意是肯定会返回2个数组成的一个数组,且数组中同一个元素不可以使用两遍。
 *  因此我们将数组拆分为两个,进行双重的遍历,每次遍历的时候去检查剩余数组中是否存在值与当前值
 *  相加结果为target,由于剩余数组是从原始数组中剔除当前值之后的数组,返回的值需要使用index+1+j
 *  此方法思路较简单,但是双重遍历加构造数组,时间复杂度：O(n^2)。
 *  运行时间 740 ms 内存消耗 42.7 MB
 *  ----------------------------------------------------------------
 */
var twoSum = function (nums, target) {
    let arr = [];
    nums.map((item, index) => {
        const rest = nums.slice(index+1);
        const j = rest.findIndex(ritem => item + ritem == target);
        if (j> -1) {
            arr = [index, index+j+1];
        }
    })
    return arr;
};

```

- 双层遍历,优化差值查找

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        const dif = target - nums[i];
        // j = i + 1 的目的是减少重复计算和避免两个元素下标相同
        for (let j = i + 1; j < nums.length; j++) {
            if(nums[j] == dif)
                return [i,j];
        }
    }
};
```

