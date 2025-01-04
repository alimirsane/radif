import pandas as pd
from django.db.models import Sum
from apps.lab.models import *
from apps.account.models import *
from django.utils.timezone import is_aware


def generate_excel_report():
    data = []

    # Fetch all parent requests
    parent_requests = Request.objects.filter(has_parent_request=False)

    for parent_request in parent_requests:
        # Gather parent request data
        parent_data = {
            'Parent Request Number': parent_request.request_number,
            'Parent Owner': parent_request.owner.get_full_name(),
            'Parent Experiment': parent_request.experiment.name,
            'Parent Price': parent_request.price,
            'Parent Discount': parent_request.discount,
            'Parent Created At': parent_request.created_at.replace(tzinfo=None) if is_aware(
                parent_request.created_at) else parent_request.created_at,
        }

        # Fetch child requests for the parent request
        child_requests = parent_request.child_requests.all()

        for child_request in child_requests:
            # Gather child request data
            child_data = {
                'Child Request Number': child_request.request_number,
                'Child Owner': child_request.parent_request.owner.get_full_name(),
                'Child Experiment': child_request.experiment.name,
                'Child Price': child_request.price,
                'Child Discount': child_request.discount,
                'Child Created At': child_request.created_at.replace(tzinfo=None) if is_aware(
                    child_request.created_at) else child_request.created_at,
            }

            # Combine parent and child data
            combined_data = {**parent_data, **child_data}

            # Fetch parameters for the child request
            parameters = child_request.parameter.all()
            parameters_list = [param.name for param in parameters]
            combined_data['Parameters'] = ", ".join(parameters_list)

            # Fetch transactions for the parent request
            transactions = GrantTransaction.objects.filter(grant_record__receiver=parent_request.owner)
            transactions_total = transactions.aggregate(total_amount=Sum('amount'))['total_amount'] or 0
            combined_data['Parent Transactions Total'] = transactions_total

            # Add row to data
            data.append(combined_data)

    # Convert data to pandas DataFrame
    df = pd.DataFrame(data)

    # Save to Excel file
    file_path = 'parent_child_report.xlsx'
    df.to_excel(file_path, index=False)
    return file_path
