import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder,  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { TarjetaCredito } from '../../models/TarjetaCredito';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar Tarjeta';
  id: string | undefined;

  constructor(private fb: FormBuilder, private tarjetaService: TarjetaService, private toastr: ToastrService) { 
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['',  [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['',  [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    })
  }

  ngOnInit(): void {
    this.tarjetaService.getTarjetaEdit().
    subscribe(data =>{
      console.log(data);
      this.id = data.id;
      this.titulo = 'Editar Tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    })
  }

  guardarTarjeta(){
    if(this.id === undefined){
      // Creamos una nueva tarjeta
      this.agregarTarjeta();
    }else{
      // Editamos la tarjeta
      this.editarTarjeta(this.id);
    } 
  }

  agregarTarjeta(){
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this.tarjetaService.guardarTarjeta(TARJETA)
    .then( ()=>{
      this.loading = false;
      console.log('tarjeta registada');
      this.toastr.success('??La tarjeta fue registrada con ??xito!', 'Tarjeta registrada');
      this.form.reset();
    }, error =>{
      this.loading = false;
      console.log(error);
      this.toastr.error('??Opps... ocurri?? un error!', 'Error');
    }) 
  }

  editarTarjeta(id: string){
    const TARJETA: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this.tarjetaService.editarTarjeta(id,TARJETA).
    then(() =>{
      this.loading = false;
      this.titulo = 'Agregar Tarjeta';
      this.form.reset();
      this.id = undefined;
      this.toastr.info('La tarjeta fue actualizada con ??xito', 'Registro Actualizado');
    }, error =>{
      console.log(error);
    })
  }
}
