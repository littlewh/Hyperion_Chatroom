#include<cstdio>
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
const int maxn = 1e3+5;

int main(){

	freopen("LIST.in","r",stdin);
	freopen("NAME.out","w",stdout);
	string s;
	while (cin >> s)
	{
		int pos = 0;
		cout<<"'";
		for(int i = 0;i< s.length();i++)
		{
			if(s[i] == '.')
			{
				pos = i;
				break;
			}
			cout<<s[i];
		}
		cout<<"',"<<endl;
	}
	return 0;
}

