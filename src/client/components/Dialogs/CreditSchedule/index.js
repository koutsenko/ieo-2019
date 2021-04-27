import styles from "./index.module.css";
import React, { Component } from "react";

import { Grid } from "@material-ui/core";

import getFullCreditSum from "common/selectors/fullCreditSum";
import buildCredit from "common/calc/buildCredit";
import {
  CREDIT_SCHEDULE_DIALOG_HEADER,
  CREDIT_SCHEDULE_DIALOG_INFO,
  CREDIT_SCHEDULE_DIALOG_PAYMENTS
} from "common/constants/messages";
import generateNextFinancialPropertyId from "common/selectors/nextFinancialPropertyId";
import CustomDialog from "common/ui-kit/CustomDialog";
import CustomTable from "common/ui-kit/CustomTable";
import CustomLabel from "common/ui-kit/CustomLabel";
import CustomText from "common/ui-kit/CustomText";
import { fmt } from "common/utils/money";
import viewCreditPeriods from "common/calc/viewCreditPeriods";

class CreditScheduleDialog extends Component {
  static getDerivedStateFromProps(props) {
    const { id, percent, principal, orderedTurnState, years } = props;
    const { liabilities, turn } = orderedTurnState;
    const credit = buildCredit(
      id,
      "credit",
      principal,
      years,
      percent,
      generateNextFinancialPropertyId(liabilities, id)
    );
    const periods = viewCreditPeriods(turn, years, credit, principal, percent);
    const formattedPeriods = periods.map(p => [
      p[0],
      p[1],
      fmt(p[2]),
      fmt(p[3]),
      fmt(p[4]),
      fmt(p[5])
    ]);

    return {
      credit,
      formattedPeriods,
      periods
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      credit: null
    };
  }

  render() {
    const { percent, principal, years } = this.props;
    const { onClose } = this.props;
    const { credit, periods, formattedPeriods } = this.state;
    const fcs = getFullCreditSum(credit);

    return (
      <CustomDialog
        {...{
          width: 900,
          actions: {
            Close: onClose
          },
          title: CREDIT_SCHEDULE_DIALOG_HEADER,
          content: (
            <div className={styles.scheduleContent}>
              <div className={styles.scheduleHeader}>
                <div className={styles.fix}>
                  <CustomText>{CREDIT_SCHEDULE_DIALOG_INFO}</CustomText>
                </div>
                <Grid container spacing={0}>
                  {/* Row 1 */}
                  <Grid item xs={2}>
                    <CustomLabel>Percent</CustomLabel>
                  </Grid>
                  <Grid item xs={2}>
                    <CustomLabel>{fmt(percent)}</CustomLabel>
                  </Grid>
                  <Grid item xs={8}>
                    &nbsp;
                  </Grid>

                  {/* Row 2 */}
                  <Grid item xs={2}>
                    <CustomLabel>Years</CustomLabel>
                  </Grid>
                  <Grid item xs={2}>
                    <CustomLabel>{years}</CustomLabel>
                  </Grid>
                  <Grid item xs={8}>
                    &nbsp;
                  </Grid>

                  {/* Row 3 */}
                  <Grid item xs={2}>
                    <CustomLabel>Principal </CustomLabel>
                  </Grid>
                  <Grid item xs={2}>
                    <CustomLabel>{fmt(principal)}</CustomLabel>
                  </Grid>
                  <Grid item xs={8}>
                    &nbsp;
                  </Grid>

                  {/* Row 4 */}
                  <Grid item xs={2}>
                    <CustomLabel>Credit sum </CustomLabel>
                  </Grid>
                  <Grid item xs={2}>
                    <CustomLabel>{fmt(fcs)}</CustomLabel>
                  </Grid>
                  <Grid item xs={8}>
                    &nbsp;
                  </Grid>
                </Grid>
                <br />
                <div className={styles.fix}>
                  <CustomText>{CREDIT_SCHEDULE_DIALOG_PAYMENTS}</CustomText>
                </div>
              </div>
              <div className={styles.scheduleTable}>
                <CustomTable
                  {...{
                    cols: [
                      "Pmt No." /* Номер платежа, начиная с единицы. */,
                      "Pmt date" /* Дата платежа, в игре - ежегодный */,
                      "Total payment" /* Сумма платежа, фиксированная, состоит из части тела и части процентов */,
                      "Interest payment" /* Часть с процентами за кредит */,
                      "Principal payment" /* Часть тела кредита */,
                      "Principal balance" /* Остаток от полной стоимости кредита */
                    ],
                    data: formattedPeriods,
                    keys: periods.map(p => p[0]),
                    noGrow: true
                  }}
                />
              </div>
            </div>
          )
        }}
      />
    );
  }
}

export default CreditScheduleDialog;
