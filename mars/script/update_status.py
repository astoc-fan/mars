from mars.extensions import db
from mars.models import Invoices


# app = mars.create_app()


def update_invoice_status(ei_invoice_ref, tax_ref, tai_scan_date, gci, customer_name, file, amount, currency,
                          vat_invoice_ref, department, status, user_email, customer_email):
    invoice = Invoices.query.filter_by(tax_ref=tax_ref).first()
    if invoice:
        invoice.tax_ref = tax_ref
        invoice.tai_scan_date = tai_scan_date
        invoice.gci = gci
        invoice.customer_name = customer_name
        # invoice.ei_invoice_ref = ei_invoice_ref
        invoice.file = file
        invoice.amount = amount
        invoice.currency = currency
        invoice.vat_invoice_ref = vat_invoice_ref
        invoice.department = department
        invoice.status = status
        invoice.user_email = user_email
        invoice.customer_email = customer_email
        db.session.add(invoice)
        db.session.commit()
    else:
        invoice = Invoices(ei_invoice_ref=ei_invoice_ref, tax_ref=tax_ref, tai_scan_date=tai_scan_date, gci=gci,
                           customer_name=customer_name, file=file, amount=amount, currency=currency,
                           vat_invoice_ref=vat_invoice_ref, department=department, status=status, user_email=user_email,
                           customer_email=customer_email)
        db.session.add(invoice)
        db.session.commit()


# def test(gci):
#     cus = Inv_Customer.query.filter_by(gci=gci).first()
#     if cus:
#         cus.name = 'bbb'
#         db.session.add(cus)
#         db.session.commit()
#     else:
#         customer = Inv_Customer(gci='gci', name='name', user='user', customer_email='customer_email',
#                                 user_email='user_email', branch='branch', department='department',
#                                 to_user_only=True, remark='remark')
#         print('999')
#         db.session.add(customer)
#         db.session.commit()
#
#
# with app.app_context():
#     test('666')
