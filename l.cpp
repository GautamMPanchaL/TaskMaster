class Solution
{
public:
    int distMoney(int money, int children)
    {
        if (children > money)
            return -1;
        if (children == money)
            return 0;
        int ans = 0;
        int  left = children;
        while (money >= 8)
        {
            money -= 8;
            ans++;
            left--;
            if (left == -1)
                return ans - 2;
        }
        if (money == 4 && left == 1)
            return ans - 1;
        if (left > money)
        {
            int k = ceil(double(left - money) / 7);
             return ans - k;
        }
        if (money != 0 && left == 0)
            return ans - 1;
        return ans;
    }
};