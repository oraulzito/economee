from django.http import JsonResponse, HttpResponse
from django_rest.permissions import IsAuthenticated
from rest_framework import authentication, viewsets
from rest_framework.decorators import action
from rest_framework.utils import json

from economeeApi.models import Balance
from economeeApi.serializers import ReleaseRRSerializer


class ChartsView(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = ReleaseRRSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return self

    @action(detail=False, methods=['GET'])
    def monthly(self, request):
        result_incomes = []
        result_expenses = []
        expenses = Balance.objects.raw("""
                                select bal.id,
                                       bal.date_reference,
                                       sum(rr.installment_value) as total
                                from "economeeApi_release" as rel
                                         left join "economeeApi_recurringrelease" as rr
                                                   on rel.id = rr.release_id
                                         inner join "economeeApi_balance" as bal
                                                    on rr.balance_id = bal.id
                                where rel.type = 0
                                  and bal.account_id = %s
                                group by bal.id
                                order by bal.date_reference;
                                           """, [self.request.query_params.get('account_id')])
        # TODO check if it`s necessary add the user id on this query
        for expense in expenses:
            result_expenses.append(
                {'id': expense.id, 'date_reference': str(expense.date_reference), 'total': expense.total})

        incomes = Balance.objects.raw("""
                        select bal.id,
                               bal.date_reference,
                               sum(rr.installment_value) as total
                        from "economeeApi_release" as rel
                                 left join "economeeApi_recurringrelease" as rr
                                           on rel.id = rr.release_id
                                 inner join "economeeApi_balance" as bal
                                            on rr.balance_id = bal.id
                        where rel.type = 1
                          and bal.account_id = %s
                          and a.owner_id = %s
                        group by bal.id
                        order by bal.date_reference;
                        """,
                                      [
                                          self.request.query_params.get('account_id'),
                                          self.request.user.id
                                      ])
        # TODO check if it`s necessary add the user id on this query
        for income in incomes:
            result_incomes.append(
                {'id': income.id, 'date_reference': str(income.date_reference), 'total': income.total})

        return JsonResponse({'incomes': result_incomes, 'expenses': result_expenses})

    @action(detail=False, methods=['GET'])
    def category(self, request):
        result = []
        results = Balance.objects.raw("""
                                        select rc.id, rc.name, sum(rr.installment_value) as total
                                        from "economeeApi_release" r
                                                 INNER JOIN "economeeApi_recurringrelease" rr on r.id = rr.release_id
                                                 INNER JOIN "economeeApi_balance" b on b.id = rr.balance_id
                                                 INNER JOIN "economeeApi_account" a on a.id = %s
                                                 INNER JOIN "economeeApi_releasecategory" rc on rc.id = r.category_id
                                        where a.id = %s
                                          and b.id = %s
                                          and a.owner_id = %s
                                          and r.type = 0
                                        GROUP BY rc.id, rc.name;
                                                   """,
                                      [
                                          self.request.query_params.get('account_id'),
                                          self.request.query_params.get('account_id'),
                                          self.request.query_params.get('balance_id'),
                                          self.request.user.id
                                      ])
        for r in results:
            result.append({"id": r.id, "name": r.name, "total": r.total})
        return HttpResponse(json.dumps(result))

    @action(detail=False, methods=['GET'])
    def timeline(self, request):
        result = []
        results = Balance.objects.raw("""
                                select b.id, b.date_reference, b.total_expenses, b.total_incomes
                                    from "economeeApi_balance" b
                                             INNER JOIN "economeeApi_account" a on a.id = b.account_id
                                where a.owner_id = %s
                                  and a.id = %s
                                  and b.date_reference BETWEEN (current_date - interval '5 months')
                                  and (current_date + interval '6 months')
                                group by b.id, b.date_reference, b.total_expenses, b.total_incomes
                                           """,
                                      [
                                          self.request.user.id,
                                          self.request.query_params.get('account_id')
                                      ])

        for r in results:
            result.append({
                "date_reference": str(r.date_reference),
                "total_expenses": r.total_expenses,
                "total_incomes": r.total_incomes
            })
        return HttpResponse(json.dumps(result))
