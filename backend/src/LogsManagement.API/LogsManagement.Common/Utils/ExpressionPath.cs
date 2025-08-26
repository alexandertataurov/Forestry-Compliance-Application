using System.Linq.Expressions;
using System.Reflection;

namespace LogsManagement.Common.Extensions;

public static class ExpressionPath
{
    public static MemberInfo GetMember(LambdaExpression expr)
    {
        Expression body = expr.Body is UnaryExpression u && u.NodeType == ExpressionType.Convert
            ? u.Operand!
            : expr.Body;

        if (body is MemberExpression m)
            return m.Member;

        throw new NotSupportedException("Only simple member access is supported, e.g. x => x.Posts.");
    }
}
